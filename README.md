# Sudoku Master — Fullstack Project

## Deliverables

- **Render Link:** (TBD)
- **Collaborators:** Xihe Mu, Junkai Ding, Chengyu Liang
- **Github Repo:** https://github.com/JunkaiDing/sudoku-project
- **Video Walkthrough:** (TBD)

---

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   ```bash
   mongod --dbpath /usr/local/var/mongodb
   ```

3. **Start the backend server (terminal 1):**
   ```bash
   npm run server
   ```

4. **Start the frontend dev server (terminal 2):**
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser.

---

## Tech Stack

- **Frontend:** React 19, React Router DOM 7, Vite 8, Axios
- **Backend:** Express 5, Mongoose, MongoDB
- **Auth:** Cookie-based with bcrypt password hashing

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with title and navigation |
| `/games` | Game selection — create Easy/Normal/Custom games, browse existing games |
| `/game/:gameId` | Play a specific Sudoku game |
| `/custom` | Create a custom 9x9 puzzle (bonus) |
| `/rules` | Game rules and credits |
| `/scores` | High score leaderboard (sorted by wins) |
| `/login` | User login |
| `/register` | User registration |

---

## RESTful APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/isLoggedIn` | GET | Check if user is logged in via cookie |
| `/api/user/login` | POST | Login with username/password, sets cookie |
| `/api/user/register` | POST | Register new user, sets cookie |
| `/api/logout` | POST | Clear authentication cookie |
| `/api/sudoku` | GET | List all games |
| `/api/sudoku` | POST | Create a new game (EASY or NORMAL) |
| `/api/sudoku/custom` | POST | Create a custom game with unique-solution validation |
| `/api/sudoku/:gameId` | GET | Get a specific game |
| `/api/sudoku/:gameId` | PUT | Update a game's board/status |
| `/api/sudoku/:gameId` | DELETE | Delete a game (creator only) |
| `/api/highscore` | GET | Get sorted high score list |
| `/api/highscore` | POST | Record a win for a game |
| `/api/highscore/:gameId` | GET | Get high score for a specific game |

---

## Project Writeup

### What were some challenges you faced while making this app?

The biggest challenge was converting the client-side-only React SPA into a fullstack application. The original project generated puzzles entirely on the frontend using `createSolvedBoard` and `createPuzzle` in `src/utils/sudoku.js`. Moving this logic to the backend required splitting the utility file — puzzle generation and solving on the server side (`backend/utils/sudoku.js`), while keeping validation functions (`getInvalidCellKeys`, `getValidValues`) on the frontend for real-time user feedback without API round-trips.

Implementing cookie-based authentication with Express and ensuring the Vite dev proxy correctly forwarded cookies was another challenge. We had to configure Axios with `withCredentials: true` and set up the Vite proxy to forward `/api` requests to the Express server on port 8000.

The custom game feature required careful backend validation — we reused the backtracking `countSolutions` algorithm to verify that a user-submitted board has exactly one unique solution before accepting it.

### Given more time, what additional features, functional or design changes would you make?

We would add a note-taking feature for candidate numbers in cells. We would also add a timer leaderboard that tracks the fastest solve times per game, not just win counts. WebSocket-based real-time multiplayer — where two users race to solve the same puzzle — would be an exciting addition. We would also deploy to Render with MongoDB Atlas for a production environment.

### What assumptions did you make while working on this assignment?

We assumed that "Easy" mode uses a 6x6 grid (2x3 subgrids) and "Normal" uses 9x9 (3x3 subgrids), consistent with Project 2. For the game list, we assumed any logged-in user can play any game, but only the game creator can delete it. For highscores, we track which users completed each game via a `completedBy` array on the Game model, and aggregate wins using a MongoDB aggregation pipeline. We assumed the solution should not be sent to the client while the game is in progress to prevent cheating.

### How long did this assignment take to complete?

This assignment took approximately 20 hours across the three of us to complete.

### What bonus points did you accomplish?

**Password Encryption (2 pts).** User passwords are hashed with bcrypt (10 salt rounds) before storage in MongoDB. Login compares the plaintext input against the stored hash using `bcrypt.compare`. See [`backend/routes/user.js`](backend/routes/user.js) lines 33–36 (login) and lines 49–51 (register).

**Delete Game (5 pts).** When a logged-in user who created a game visits the game page or the games list, a "Delete" button is shown. Clicking it calls `DELETE /api/sudoku/:gameId`, which verifies the requester is the creator before removing the game. Since highscores are computed via MongoDB aggregation over the `completedBy` field of existing Game documents, deleting a game automatically removes its wins from the leaderboard. See [`backend/routes/sudoku.js`](backend/routes/sudoku.js) (DELETE route) and [`src/pages/GamesPage.jsx`](src/pages/GamesPage.jsx) (handleDelete).

**Custom Games (10 pts).** The `/custom` page presents an empty 9x9 board where users can place numbers to define a puzzle. On submit, the board is sent to `POST /api/sudoku/custom`, where the backend runs `countSolutions` (backtracking with early termination) to verify exactly one unique solution exists. If valid, the backend solves the board with `solvePuzzle`, saves it as a new Game document with difficulty "CUSTOM", and redirects the user to play. See [`src/pages/CustomGamePage.jsx`](src/pages/CustomGamePage.jsx) and [`backend/routes/sudoku.js`](backend/routes/sudoku.js) (POST /custom route).
