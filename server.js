import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./backend/routes/user.js";
import sudokuRoutes from "./backend/routes/sudoku.js";
import highscoreRoutes from "./backend/routes/highscore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 8000;
const MONGODB_URL = "mongodb://localhost:27017/sudoku";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/sudoku", sudokuRoutes);
app.use("/api/highscore", highscoreRoutes);

// POST /api/logout — spec requires this path
app.post("/api/logout", (req, res) => {
  res.clearCookie("username");
  return res.json({ message: "Logged out" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
