import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

// GET /api/user/isLoggedIn
router.get("/isLoggedIn", async (req, res) => {
  const { username } = req.cookies;
  if (!username) {
    return res.json({ isLoggedIn: false });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ isLoggedIn: false });
    }
    return res.json({ isLoggedIn: true, username });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/user/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.cookie("username", username, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ username });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/user/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    res.cookie("username", username, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(201).json({ username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Username already taken" });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/logout
router.post("/logout", (req, res) => {
  res.clearCookie("username");
  return res.json({ message: "Logged out" });
});

export default router;
