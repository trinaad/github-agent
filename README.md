# GitHub Agent 🤖

An AI-powered assistant that connects to your GitHub account and helps you manage repos through natural language — summarizing PRs, checking issue status, and more, with its reasoning visible in real time as it works.

Built to explore agentic AI patterns (tool-use, multi-step reasoning) combined with a full-stack Angular + Node application.

---

## 🚧 Project Status
**Phase 3 complete** — Full agent loop working end-to-end: natural language request → LLM picks the right GitHub tool(s) → executes real API calls → returns a clean, formatted answer. Multi-step tool chaining confirmed working (e.g. resolving a repo name before fetching its data).

- [x] Phase 1 — Skeleton + GitHub OAuth
- [x] Phase 2 — Core GitHub API tool functions
- [x] Phase 3 — LLM-powered agent loop
- [ ] Phase 4 — Live reasoning UI
- [ ] Phase 5 — Multi-step "wow" capabilities
- [ ] Phase 6 — Deploy + polish

---

## 🛠️ Tech Stack

**Frontend:** Angular 22, TypeScript
**Backend:** Node.js, Express
**Auth:** GitHub OAuth
**AI:** Groq API (Llama/GPT-OSS models) with tool-calling

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
2. User sends a natural language request (e.g. "show me open PRs on my repo X")
3. The request + a set of available tools (listRepos, getOpenPRs, getIssues, getCommitHistory, getReadme) are sent to an LLM
4. The LLM decides which tool(s) to call and with what arguments — sometimes chaining multiple calls (e.g. resolving a repo name first, then fetching its data)
5. The backend executes each tool call against the real GitHub API
6. Results are fed back to the LLM, which produces a clean, human-readable final answer

---

## 📸 Demo
*(coming soon)*

---

## 🧠 Why I built this
Wanted to go beyond a basic chatbot wrapper and build something that actually plans and executes multi-step tasks using real tools — GitHub's API in this case — while being genuinely useful for my own dev workflow.

---

⭐ If you find this interesting, feel free to star the repo!!
