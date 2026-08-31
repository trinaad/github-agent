# GitHub Agent 🤖

An AI-powered assistant that connects to your GitHub account and helps you manage repos through natural language — summarizing PRs, checking issue status, and more, with its reasoning visible in real time as it works.

Built to explore agentic AI patterns (tool-use, multi-step reasoning) combined with a full-stack Angular + Node application.

---

## 🚧 Project Status
**Phase 1 complete** — GitHub OAuth login flow working end-to-end (Angular frontend ↔ Express backend ↔ GitHub API).

More phases in progress:
- [x] Phase 1 — Skeleton + GitHub OAuth
- [ ] Phase 2 — Core GitHub API tool functions
- [ ] Phase 3 — LLM-powered agent loop
- [ ] Phase 4 — Live reasoning UI
- [ ] Phase 5 — Multi-step "wow" capabilities
- [ ] Phase 6 — Deploy + polish

---

## 🛠️ Tech Stack

**Frontend:** Angular 22, TypeScript
**Backend:** Node.js, Express
**Auth:** GitHub OAuth
**AI:** (coming in Phase 3) Claude / OpenAI API with tool-calling

---

## 📂 Project Structure
github-agent/
├── frontend/ # Angular app
├── backend/ # Express server, OAuth + API routes
└── README.md


---

## 🚀 Getting Started

### Prerequisites
- Node.js 24.x
- A GitHub account
- A GitHub OAuth App (see below)

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

## 📸 Demo
*(coming soon)*

---

## 🧠 Why I built this
Wanted to go beyond a basic chatbot wrapper and build something that actually plans and executes multi-step tasks using real tools — GitHub's API in this case — while being genuinely useful for my own dev workflow.

---

⭐ If you find this interesting, feel free to star the repo!
