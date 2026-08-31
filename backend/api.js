const express = require("express");
const router = express.Router();

router.get("/user", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const ghResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!ghResponse.ok) {
      return res.status(ghResponse.status).json({ error: "GitHub API error" });
    }

    const userData = await ghResponse.json();
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
