# GitHub Agent 🤖

An AI-powered assistant that connects to your GitHub account and helps you manage repos through natural language — summarizing PRs, checking issue status, generating activity digests, and more, with its reasoning visible in real time as it works.

Built to explore agentic AI patterns (tool-use, multi-step reasoning) combined with a full-stack Angular + Node application.

---

## 🚧 Project Status
**Complete** — Full agent loop streaming live, with multi-step "wow" capabilities: weekly repo activity digests and cross-repo stale issue summaries, both requiring the agent to chain multiple tool calls and synthesize the results into a coherent answer.

- [x] Phase 1 — Skeleton + GitHub OAuth
- [x] Phase 2 — Core GitHub API tool functions
- [x] Phase 3 — LLM-powered agent loop
- [x] Phase 4 — Live streaming reasoning UI
- [x] Phase 5 — Multi-step "wow" capabilities

---

## 🛠️ Tech Stack

**Frontend:** Angular 22, TypeScript
**Backend:** Node.js, Express (Server-Sent Events for live streaming)
**Auth:** GitHub OAuth
**AI:** Groq API (GPT-OSS-120B) with tool-calling

---

## 📂 Project Structure
github-agent/
├── frontend/ # Angular app
├── backend/ # Express server, OAuth + API routes + agent loop
└── README.md


---

## 🚀 Getting Started

### Prerequisites
- Node.js 24.x
- A GitHub account
- A GitHub OAuth App (see below)
- A free Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone the repo
```bash
git clone https://github.com/trinaad/github-agent.git
cd github-agent
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GROQ_API_KEY=your_groq_key
PORT=3000




Run it:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
ng serve
```

Visit `http://localhost:4200`.

### 4. Register your own GitHub OAuth App
Go to [github.com/settings/developers](https://github.com/settings/developers) → New OAuth App:
- Homepage URL: `http://localhost:4200`
- Callback URL: `http://localhost:3000/auth/github/callback`

---

## 🧩 How it works

1. User logs in via GitHub OAuth
2. User sends a natural language request (e.g. "give me a weekly activity summary for repo X" or "which issues have been open over 30 days?")
3. The request + a set of available tools (listRepos, getOpenPRs, getIssues, getCommitHistory, getReadme) are sent to an LLM
4. The LLM decides which tool(s) to call and with what arguments — often chaining multiple calls, e.g. resolving a repo name first, or checking issues across every repo one by one
5. The backend streams each tool call and result to the frontend live via Server-Sent Events, visible as a real-time reasoning trace
6. Once all steps are done, the LLM synthesizes everything into a clean, markdown-rendered final answer

---

## 🧠 Why I built this
Wanted to go beyond a basic chatbot wrapper and build something that actually plans and executes multi-step tasks using real tools — GitHub's API in this case — while being genuinely useful for my own dev workflow, with its reasoning visible rather than hidden behind a spinner.

---

⭐ If you find this interesting, feel free to star the repo!
