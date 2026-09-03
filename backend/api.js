import express from "express";
import * as tools from "./tools.js";

const router = express.Router();

function getToken(req) {
  return req.headers.authorization?.split(" ")[1];
}

router.get("/user", async (req, res) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const ghResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!ghResponse.ok)
      return res.status(ghResponse.status).json({ error: "GitHub API error" });
    const userData = await ghResponse.json();
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/repos", async (req, res) => {
  try {
    const repos = await tools.listRepos(getToken(req));
    res.json(repos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/repos/:owner/:repo/prs", async (req, res) => {
  try {
    const prs = await tools.getOpenPRs(
      getToken(req),
      req.params.owner,
      req.params.repo,
    );
    res.json(prs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/repos/:owner/:repo/issues", async (req, res) => {
  try {
    const issues = await tools.getIssues(
      getToken(req),
      req.params.owner,
      req.params.repo,
    );
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/repos/:owner/:repo/commits", async (req, res) => {
  try {
    const commits = await tools.getCommitHistory(
      getToken(req),
      req.params.owner,
      req.params.repo,
    );
    res.json(commits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
