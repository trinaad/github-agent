import Groq from "groq-sdk";
import express from "express";
import * as tools from "./tools.js";
import { toolSchemas } from "./agentTools.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getToken(req) {
  return req.headers.authorization?.split(" ")[1];
}

// Maps tool names to actual functions, injecting the GitHub token automatically
function executeTool(name, args, githubToken) {
  switch (name) {
    case "listRepos":
      return tools.listRepos(githubToken);
    case "getOpenPRs":
      return tools.getOpenPRs(githubToken, args.owner, args.repo);
    case "getIssues":
      return tools.getIssues(githubToken, args.owner, args.repo);
    case "getCommitHistory":
      return tools.getCommitHistory(
        githubToken,
        args.owner,
        args.repo,
        args.count,
      );
    case "getReadme":
      return tools.getReadme(githubToken, args.owner, args.repo);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

router.post("/chat", async (req, res) => {
  const githubToken = getToken(req);
  const { message } = req.body;

  if (!githubToken)
    return res.status(401).json({ error: "No GitHub token provided" });
  if (!message) return res.status(400).json({ error: "No message provided" });

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  function sendEvent(data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  const messages = [
    {
      role: "system",
      content: `You are a helpful GitHub assistant. Use the available tools to answer questions about the user's repos, PRs, issues, and commits.

                When asked for a "digest", "summary", or "activity report" on a repo, call multiple relevant tools (commits, issues, PRs) and synthesize them into one coherent narrative — don't just list raw data.

                When asked about issues "across all repos" or similar, first call listRepos, then call getIssues for each relevant repo, then combine and summarize the results.

                When filtering by time (e.g. "this week", "older than 30 days"), use the date fields already present in tool results to filter yourself — don't ask the user for a date range.
 
                Be concise and clear in your final answers. Use markdown tables where they help readability.`,
    },
    { role: "user", content: message },
  ];

  try {
    let finalAnswer = null;
    let loopCount = 0;
    const MAX_LOOPS = 10;

    while (!finalAnswer && loopCount < MAX_LOOPS) {
      loopCount++;

      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages,
        tools: toolSchemas,
        tool_choice: "auto",
      });

      const responseMessage = completion.choices[0].message;
      messages.push(responseMessage);

      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        for (const toolCall of responseMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          sendEvent({ type: "tool_call", tool: toolName, args: toolArgs });

          let result;
          try {
            result = await executeTool(toolName, toolArgs, githubToken);
          } catch (err) {
            result = { error: err.message };
          }

          sendEvent({ type: "tool_result", tool: toolName, result });

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }
      } else {
        finalAnswer = responseMessage.content;
      }
    }

    sendEvent({
      type: "final_answer",
      answer:
        finalAnswer ||
        "I was unable to complete this request within the step limit.",
    });
    sendEvent({ type: "done" });
    res.end();
  } catch (err) {
    console.error(err);
    sendEvent({ type: "error", error: err.message });
    res.end();
  }
});

export default router;
