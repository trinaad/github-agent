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

  const messages = [
    {
      role: "system",
      content:
        "You are a helpful GitHub assistant. Use the available tools to answer questions about the user's repos, PRs, issues, and commits. Be concise and clear in your final answers.",
    },
    { role: "user", content: message },
  ];

  const steps = []; // track reasoning steps for the UI later

  try {
    let finalAnswer = null;
    let loopCount = 0;
    const MAX_LOOPS = 5;

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

          steps.push({ type: "tool_call", tool: toolName, args: toolArgs });

          let result;
          try {
            result = await executeTool(toolName, toolArgs, githubToken);
          } catch (err) {
            result = { error: err.message };
          }

          steps.push({ type: "tool_result", tool: toolName, result });

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

    res.json({
      answer:
        finalAnswer ||
        "I was unable to complete this request within the step limit.",
      steps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
