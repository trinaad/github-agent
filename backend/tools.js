import { Octokit } from "octokit";

function getClient(token) {
  return new Octokit({ auth: token });
}

export async function listRepos(token) {
  const octokit = getClient(token);
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 20,
  });
  return data.map((repo) => ({
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private,
    updated_at: repo.updated_at,
    open_issues: repo.open_issues_count,
  }));
}

export async function getOpenPRs(token, owner, repo) {
  const octokit = getClient(token);
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
  });
  return data.map((pr) => ({
    number: pr.number,
    title: pr.title,
    author: pr.user.login,
    created_at: pr.created_at,
    url: pr.html_url,
  }));
}

export async function getIssues(token, owner, repo) {
  const octokit = getClient(token);
  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: "open",
  });
  const issuesOnly = data.filter((issue) => !issue.pull_request);
  return issuesOnly.map((issue) => ({
    number: issue.number,
    title: issue.title,
    author: issue.user.login,
    created_at: issue.created_at,
    url: issue.html_url,
  }));
}

export async function getCommitHistory(token, owner, repo, count = 10) {
  const octokit = getClient(token);
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: count,
  });
  return data.map((commit) => ({
    sha: commit.sha.substring(0, 7),
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
  }));
}

export async function getReadme(token, owner, repo) {
  const octokit = getClient(token);
  try {
    const { data } = await octokit.rest.repos.getReadme({ owner, repo });
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (err) {
    return null;
  }
}
