# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fullstack Sudoku app (React + Express + MongoDB) with real authentication, game persistence, highscores, and puzzle generation. Supports Easy (6x6), Normal (9x9), and Custom (user-created) game modes. Collaborators: Xihe Mu, Junkai Ding, Chengyu Liang.

## Commands

- **Frontend dev server:** `npm run dev` (Vite on port 5173, proxies `/api` to port 8000)
- **Backend server:** `npm run server` (Express on port 8000, requires MongoDB running)
- **Build:** `npm run build` (outputs to `/dist`)
- **Full dev:** Run `npm run server` and `npm run dev` in separate terminals
- No test framework is configured.

## Architecture

**Stack:** React 19 + React Router DOM 7 (BrowserRouter) + Vite 8 | Express 5 + Mongoose + MongoDB

### Backend (`/server.js` + `/backend/`)

- **server.js** — Express entry point on port 8000. Middleware: json, urlencoded, cookieParser. In production serves `/dist` static files.
- **Models:** `User` (username unique, bcrypt-hashed password) and `Game` (name, difficulty, createdBy, solution, initialBoard, board, status, config, completedBy[])
- **Routes:**
  - `/api/user` — isLoggedIn (GET), login (POST), register (POST)
  - `/api/logout` — POST (separate mount in server.js)
  - `/api/sudoku` — GET list, POST create, POST /custom (must be before /:gameId). GET/PUT/DELETE /:gameId
  - `/api/highscore` — GET aggregated scores, POST record win, GET /:gameId
- **Auth:** Cookie-based (`username` cookie), passwords hashed with bcrypt (salt rounds: 10)
- **Puzzle generation:** `backend/utils/sudoku.js` — createSolvedBoard, createPuzzle (with unique-solution guarantee via countSolutions), solvePuzzle (for custom games)
- **Game names:** `backend/utils/words.js` — 1000+ word list, generateGameName() picks 3 random capitalized words

### Frontend (`/src/`)

- **Routing (App.jsx):** BrowserRouter with routes: `/`, `/games`, `/game/:gameId`, `/custom`, `/rules`, `/scores`, `/login`, `/register`
- **Contexts:**
  - `AuthContext` — user state, login/register/logout, checks cookie on mount via `/api/user/isLoggedIn`
  - `GameContext` — game state with useReducer. Actions: loadGame (from API data), reset, selectCell, setCellValue, tick
- **API layer:** `src/utils/api.js` — Axios with withCredentials:true, all API call functions
- **Validation:** `src/utils/sudoku.js` — cloneBoard, getInvalidCellKeys, isBoardComplete, formatElapsedTime, getValidValues (kept on frontend for real-time feedback + hints)
- **Key pages:**
  - `GamesPage` — Create Easy/Normal/Custom buttons + game list from API
  - `GamePage` — Loads game by :gameId from API, debounced save (2s), records win via highscore API
  - `CustomGamePage` — Empty 9x9 board, submits to POST /api/sudoku/custom for unique-solution validation

### Key Design Decisions

- Solution is never sent to client unless game status is "won" (prevents cheating)
- Highscores aggregated from Game.completedBy array via MongoDB aggregation pipeline
- Logged-out users can view all pages but cannot interact (cells disabled, create buttons hidden)
- Game deletion only allowed by creator; auto-removes from highscore aggregation

## Styling

Two CSS files: `common.css` (global: navbar, buttons, layout, CSS variables) and `src/styles/app.css` (game-specific). Responsive breakpoints at 768px and 540px.

## Deployment

- Dev: Vite proxy forwards `/api` to Express at localhost:8000
- Prod: Express serves built Vite output from `/dist`, catch-all returns index.html for BrowserRouter
- MongoDB connection: `mongodb://localhost:27017/sudoku` (configured in server.js)
