import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./auth.js";
import apiRoutes from "./api.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
