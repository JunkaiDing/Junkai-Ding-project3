# Sudoku Master Project

## Deliverables

- **Render Link:** https://junkaiding.github.io/sudoku-project/
- **Collaborators:** Xihe Mu, Junkai Ding, Chengyu Liang
- **Github Repo:** https://github.com/JunkaiDing/sudoku-project
- **Video Walkthrough:** [TODO: Add new video link here]

---

## Project Writeup

### What were some challenges you faced while making this app? 

The most challenging part of this assignment was migrating our static HTML/CSS multi-page application into a React Single Page Application while maintaining the existing visual design and page structure. Managing the global game state using the Context API with `useReducer` required careful planning, particularly around immutability — every board update must produce a new array so React detects the change and re-renders correctly. The puzzle generation algorithm also presented a significant challenge: simply removing cells at random can produce puzzles with multiple valid solutions, so we had to implement a backtracking `countSolutions` function ([src/utils/sudoku.js](src/utils/sudoku.js#L82)) that verifies a puzzle has exactly one solution before accepting each removal, which added meaningful algorithmic complexity to the project.

### Given more time, what additional features, functional or design changes would you make?

If we had more time, we would add a note taking function that lets players annotate cells with small candidate numbers. We would also introduce more difficulty levels. We would replace the mocked login/register pages and mock high-scores table with a real backend so that user accounts and puzzle-completion records actually persist across devices and sessions.

### What assumptions did you make while working on this assignment?

We assumed that "Easy" mode should use a smaller 6×6 grid (2×3 subgrids, values 1–6) to make the game more accessible for beginners, while "Normal" uses the standard 9×9 layout. For the authentication pages (Login and Register), we assumed a fully mocked UI was acceptable for this project phase and noted this explicitly in the UI, since no backend was in scope. We assumed when player enter a differnent game mode, he wanna play a new game and we will not save his old game.

### How long did this assignment take to complete?

This assignment took approximately 15 hours across the three of us to complete.

### What bonus points did you accomplish?

We successfully implemented two bonus features:

**Local Storage persistence (3 pts).** When a game is in progress, the full game state — including the current board, the initial (given) cells, the solution, the elapsed timer is serialized to `localStorage` under the key `sudoku-game-state` after every move. On the next visit the state is rehydrated in the `GameProvider` initializer so the player resumes exactly where they left off. The save is cleared automatically when the player wins or explicitly resets the board. The relevant code lives in [`src/context/GameContext.jsx`](src/context/GameContext.jsx#L84) (initial load from storage, lines 84–105) and the `useEffect` that writes on every state change (lines 107–116).

**Backtracking unique-solution guarantee (4 pts).** After generating a fully solved board, `createPuzzle` removes cells one at a time in a shuffled order. Before accepting each removal it calls [`countSolutions`](src/utils/sudoku.js#L82) ([src/utils/sudoku.js lines 82–98](src/utils/sudoku.js#L82)), a recursive backtracking function that traverses every empty cell and tries every value still valid for that position. The recursion short-circuits as soon as a second solution is found (`limit` parameter), so it never does more work than necessary. If removing a cell would allow more than one solution, the cell is restored and skipped. This guarantees that every puzzle we generate has exactly one valid solution.
