# Sudoku Master - Fullstack Sudoku Project

A fullstack Sudoku application built with React, Express, MongoDB, and cookie-based authentication.  
This project extends a frontend-only Sudoku app into a complete web application with user accounts, persistent games, and a high score leaderboard.

## Project Links

- Github Repo: https://github.com/JunkaiDing/sudoku-project
- Video Walkthrough: https://youtu.be/vRaebDXnRqw
- Deployed App (Render): TBD
- Collaborators: Xihe Mu, Junkai Ding, Chengyu Liang

## Tech Stack

- Frontend: React 19, React Router DOM 7, Vite 8, Axios
- Backend: Express 5, Mongoose, MongoDB
- Authentication: Cookie-based auth
- Security: bcrypt password hashing

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

Use your local MongoDB service, or run:

```bash
mongod
```

### 3. Set environment variables (optional)

The server supports:

- `PORT` (default: `8000`)
- `MONGODB_URL` (default: `mongodb://localhost:27017/sudoku`)

Example (PowerShell):

```powershell
$env:MONGODB_URL="mongodb://localhost:27017/sudoku"
$env:PORT="8000"
```

### 4. Start backend and frontend

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8000`.

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run server` - Start Express backend server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production frontend build

## Page Routes

| Route | Purpose |
|---|---|
| `/` | Home page with game title and navigation |
| `/games` | Game selection page, create/browse games |
| `/game/:gameId` | Sudoku gameplay page |
| `/custom` | Create a custom Sudoku puzzle (bonus) |
| `/rules` | Rules and credits |
| `/scores` | Global high score leaderboard |
| `/login` | Login page |
| `/register` | Register page |

## REST API

### User APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/user/isLoggedIn` | GET | Check login state via cookie |
| `/api/user/login` | POST | Login with username/password, sets cookie |
| `/api/user/register` | POST | Register user, sets cookie |
| `/api/user/logout` | POST | Logout via user router |
| `/api/logout` | POST | Logout endpoint used by frontend |

### Sudoku APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/sudoku` | GET | List all games (name, difficulty, creator, date, status) |
| `/api/sudoku` | POST | Create game with `difficulty` = `EASY` or `NORMAL` |
| `/api/sudoku/custom` | POST | Create custom 9x9 game (must have exactly one solution) |
| `/api/sudoku/:gameId` | GET | Get one game |
| `/api/sudoku/:gameId` | PUT | Update board/status |
| `/api/sudoku/:gameId` | DELETE | Delete game (creator only) |

### Highscore APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/highscore` | GET | Get sorted leaderboard (wins desc, username asc) |
| `/api/highscore` | POST | Record win for a game |
| `/api/highscore/:gameId` | GET | Get completion status for one game |

## Data Model (MongoDB)

### `users` collection

- `username` (unique)
- `password` (bcrypt hash)
- `createdAt`, `updatedAt`

### `games` collection

- `name` (random 3-word name)
- `difficulty` (`EASY`, `NORMAL`, `CUSTOM`)
- `createdBy`
- `solution`
- `initialBoard`
- `board`
- `status` (`playing`, `won`)
- `config`
- `completedBy` (array of usernames)
- `createdAt`, `updatedAt`

## Feature Checklist (Rubric Coverage)

- Core functionality: implemented
- Required pages and navigation: implemented
- Logged-out read-only experience: implemented
- RESTful APIs with GET/POST/PUT/DELETE: implemented
- MongoDB + Mongoose integration: implemented
- Cookie-based auth + password hashing: implemented
- Styling and responsive layout: implemented

## Bonus Features Completed

### Password Encryption (+2)

Passwords are hashed with bcrypt before storage, and verified with bcrypt compare on login.

### Delete Game (+5)

Game creator can delete their own game via `DELETE /api/sudoku/:gameId`.  
Leaderboard is derived from existing game data, so deleted games no longer contribute wins.

### Custom Games (+10)

Users can create custom Sudoku boards at `/custom`.  
Backend validates the puzzle has exactly one unique solution before saving.

## Project Writeup

### 1. Challenges

One major challenge was migrating Sudoku generation/solving from a frontend-only architecture to a true fullstack design while keeping the UI responsive. We moved puzzle generation and solving logic to backend utilities and retained client-side validation for immediate player feedback.

Another challenge was cookie-based authentication across Vite + Express. We configured Axios with `withCredentials: true`, set up proxying for `/api`, and standardized cookie checks in backend routes.

The custom game feature was also challenging because puzzle validity had to be checked on the backend using backtracking and solution counting to ensure exactly one solution.

### 2. What we would add with more time

- Pencil marks / candidate notes per cell
- Time-based leaderboard (fastest solve per puzzle)
- User profile and game history page
- Multiplayer race mode (real-time)
- Full production deployment with MongoDB Atlas + Render

### 3. Assumptions

- Easy mode uses a 6x6 board, normal mode uses 9x9
- Any logged-in user can play any game
- Only game creators can delete their own games
- Ongoing game solutions are not sent to clients to avoid cheating
- High scores are based on completed games per user

### 4. Time Spent

Approximately 20 hours total for the team.

### 5. Bonus Summary

- Password encryption: completed
- Delete game: completed
- Custom games: completed

## Submission Deliverables

- Github repository link
- Deployed application link
- Video walkthrough link
- Project writeup
- Collaborator names
