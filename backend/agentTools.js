export const toolSchemas = [
  {
    type: "function",
    function: {
      name: "listRepos",
      description:
        "List the user's GitHub repositories, sorted by most recently updated.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "getOpenPRs",
      description: "Get open pull requests for a specific repository.",
      parameters: {
        type: "object",
        properties: {
          owner: { type: "string", description: "Repository owner username" },
          repo: { type: "string", description: "Repository name" },
        },
        required: ["owner", "repo"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getIssues",
      description: "Get open issues for a specific repository.",
      parameters: {
        type: "object",
        properties: {
          owner: { type: "string", description: "Repository owner username" },
          repo: { type: "string", description: "Repository name" },
        },
        required: ["owner", "repo"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCommitHistory",
      description: "Get recent commit history for a specific repository.",
      parameters: {
        type: "object",
        properties: {
          owner: { type: "string", description: "Repository owner username" },
          repo: { type: "string", description: "Repository name" },
          count: {
            type: "number",
            description: "Number of commits to fetch (default 10)",
          },
        },
        required: ["owner", "repo"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getReadme",
      description: "Get the README content of a specific repository.",
      parameters: {
        type: "object",
        properties: {
          owner: { type: "string", description: "Repository owner username" },
          repo: { type: "string", description: "Repository name" },
        },
        required: ["owner", "repo"],
      },
    },
  },
];
