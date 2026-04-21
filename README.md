## Project Links

- Github Repo: https://github.com/JunkaiDing/sudoku-project
- Video Walkthrough: https://youtu.be/vRaebDXnRqw
- Deployed App (Render): https://junkai-ding-project3.onrender.com/
- Collaborators: Xihe Mu, Junkai Ding, Chengyu Liang

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
