import express from "express";
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

router.get("/github", (req, res) => {
  const redirectUri = "http://localhost:3000/auth/github/callback";
  const scope = "repo read:user";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

router.get("/github/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect("http://localhost:4200?error=no_code");
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.redirect(`http://localhost:4200?error=${tokenData.error}`);
    }

    const accessToken = tokenData.access_token;
    res.redirect(`http://localhost:4200?token=${accessToken}`);
  } catch (err) {
    console.error(err);
    res.redirect("http://localhost:4200?error=server_error");
  }
});

export default router;
