import { Router } from "express";
import Game from "../models/Game.js";
import {
  GAME_MODE_CONFIGS,
  cloneBoard,
  createSolvedBoard,
  createPuzzle,
  countSolutions,
  solvePuzzle,
} from "../utils/sudoku.js";
import { generateGameName } from "../utils/words.js";

const router = Router();

// GET /api/sudoku — list all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.find(
      {},
      "name difficulty createdBy createdAt status config",
    ).sort({ createdAt: -1 });
    return res.json(games);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/sudoku/custom — create custom game (bonus)
// Must be defined BEFORE /:gameId to avoid route conflict
router.post("/custom", async (req, res) => {
  const { username } = req.cookies;
  if (!username) {
    return res.status(401).json({ error: "Must be logged in" });
  }

  const { board } = req.body;
  if (!board || !Array.isArray(board)) {
    return res.status(400).json({ error: "Board is required" });
  }

  const config = GAME_MODE_CONFIGS.normal;

  // Validate board dimensions
  if (board.length !== config.size || board.some((row) => row.length !== config.size)) {
    return res.status(400).json({ error: "Board must be 9x9" });
  }

  // Validate cell values
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      const v = board[r][c];
      if (!Number.isInteger(v) || v < 0 || v > config.maxValue) {
        return res.status(400).json({ error: "Invalid cell values" });
      }
    }
  }

  try {
    const solutions = countSolutions(cloneBoard(board), config);
    if (solutions !== 1) {
      return res.status(400).json({
        error:
          solutions === 0
            ? "This board has no valid solution"
            : "This board has multiple solutions. It must have exactly one unique solution.",
      });
    }

    const solution = solvePuzzle(board, config);
    const name = generateGameName();

    const game = new Game({
      name,
      difficulty: "CUSTOM",
      createdBy: username,
      solution,
      initialBoard: cloneBoard(board),
      board: cloneBoard(board),
      status: "playing",
      config,
    });
    await game.save();

    return res.status(201).json({ gameId: game._id, name: game.name });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/sudoku — create new game
router.post("/", async (req, res) => {
  const { username } = req.cookies;
  if (!username) {
    return res.status(401).json({ error: "Must be logged in" });
  }

  const { difficulty } = req.body;
  const key = difficulty?.toLowerCase();
  const config = GAME_MODE_CONFIGS[key];
  if (!config) {
    return res.status(400).json({ error: "Difficulty must be EASY or NORMAL" });
  }

  try {
    const solution = createSolvedBoard(config);
    const initialBoard = createPuzzle(solution, config);
    const name = generateGameName();

    const game = new Game({
      name,
      difficulty: difficulty.toUpperCase(),
      createdBy: username,
      solution,
      initialBoard,
      board: cloneBoard(initialBoard),
      status: "playing",
      config,
    });
    await game.save();

    return res.status(201).json({ gameId: game._id, name: game.name });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/sudoku/:gameId — get a single game
router.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    // Don't send solution to client (prevent cheating) unless game is won
    const gameObj = game.toObject();
    if (game.status !== "won") {
      delete gameObj.solution;
    }
    return res.json(gameObj);
  } catch {
    return res.status(404).json({ error: "Game not found" });
  }
});

// PUT /api/sudoku/:gameId — update game board
router.put("/:gameId", async (req, res) => {
  const { username } = req.cookies;
  if (!username) {
    return res.status(401).json({ error: "Must be logged in" });
  }

  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (req.body.board) {
      game.board = req.body.board;
    }
    if (req.body.status) {
      game.status = req.body.status;
    }

    await game.save();
    return res.json({ message: "Game updated" });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/sudoku/:gameId — delete game (bonus: creator only)
router.delete("/:gameId", async (req, res) => {
  const { username } = req.cookies;
  if (!username) {
    return res.status(401).json({ error: "Must be logged in" });
  }

  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    if (game.createdBy !== username) {
      return res.status(403).json({ error: "Only the creator can delete this game" });
    }

    await Game.findByIdAndDelete(req.params.gameId);
    return res.json({ message: "Game deleted" });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
