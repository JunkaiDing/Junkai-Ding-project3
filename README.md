# Sudoku Master Project

## Deliverables

- **Render Link:** [TODO: Add Render link here]
- **Collaborators:** Xihe Mu, Junkai Ding, Chengyu Liang
- **Github Repo:** https://github.com/JunkaiDing/sudoku-project
- **Video Walkthrough:** [TODO: Add new video link here]

---

## Project Writeup

### What were some challenges you faced while making this app?

The most challenging part of this assignment was migrating our static HTML/CSS multi-page application into a React Single Page Application while maintaining the existing visual design. Managing the global game state using the Context API required careful planning, especially when handling the complex validation logic to check rows, columns, and subgrids for duplicate numbers.

### Given more time, what additional features, functional or design changes would you make?

If we had more time, we would also love to add a "Note Taking Mode" that allows players to annotate cells with small candidate numbers, similar to professional Sudoku apps. Finally, we would connect the application to a real backend database to persist user accounts instead of storing it in the local cache.

### What assumptions did you make while working on this assignment?

We assumed that the "Easy" mode should be a smaller 6x6 grid to make it more accessible for beginners, while the "Normal" mode would be the standard 9x9 size. We also assumed that when a user inputs an invalid number that conflicts with existing numbers, the game should immediately highlight the conflicting cells in red to provide instant feedback, rather than waiting for the user to click a "check" button.

### How long did this assignment take to complete?

This assignment took approximately 15 hours (3 of us in total) to complete.

### What bonus points did you accomplish?

We successfully implemented the **Local Storage** bonus point (3 pts). //todo
