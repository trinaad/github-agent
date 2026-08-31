require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());

const authRoutes = require("./auth");
app.use("/auth", authRoutes);

const apiRoutes = require("./api");
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
