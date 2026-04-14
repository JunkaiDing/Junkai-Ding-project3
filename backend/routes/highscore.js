import { Router } from "express";
import Game from "../models/Game.js";

const router = Router();

// GET /api/highscore — sorted high score list
router.get("/", async (req, res) => {
  try {
    const scores = await Game.aggregate([
      { $match: { completedBy: { $exists: true, $ne: [] } } },
      { $unwind: "$completedBy" },
      {
        $group: {
          _id: "$completedBy",
          wins: { $sum: 1 },
        },
      },
      { $sort: { wins: -1, _id: 1 } },
      { $project: { _id: 0, username: "$_id", wins: 1 } },
    ]);
    return res.json(scores);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/highscore — record a win for a specific game
router.post("/", async (req, res) => {
  const { username } = req.cookies;
  if (!username) {
    return res.status(401).json({ error: "Must be logged in" });
  }

  const { gameId } = req.body;
  if (!gameId) {
    return res.status(400).json({ error: "gameId is required" });
  }

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Add user to completedBy if not already there
    if (!game.completedBy.includes(username)) {
      game.completedBy.push(username);
    }
    game.status = "won";
    await game.save();

    return res.json({ message: "High score recorded" });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/highscore/:gameId — high score for specific game
router.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findById(
      req.params.gameId,
      "name status completedBy createdBy",
    );
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    return res.json({
      gameId: game._id,
      name: game.name,
      won: game.status === "won",
      completedBy: game.completedBy,
      createdBy: game.createdBy,
    });
  } catch {
    return res.status(404).json({ error: "Game not found" });
  }
});

export default router;
