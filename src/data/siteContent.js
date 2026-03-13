export const GAME_MODE_CONFIGS = {
  easy: {
    mode: "easy",
    title: "Easy Level",
    route: "/games/easy",
    description: "A gentle 6x6 puzzle that is perfect for warming up your logic skills.",
    author: "Xihe Mu",
    size: 6,
    subRows: 2,
    subCols: 3,
    maxValue: 6,
    givens: 18,
  },
  normal: {
    mode: "normal",
    title: "Normal Level",
    route: "/games/normal",
    description: "The classic 9x9 Sudoku board with a more challenging number layout.",
    author: "Xihe Mu",
    size: 9,
    subRows: 3,
    subCols: 3,
    maxValue: 9,
    givensRange: [28, 30],
  },
};

export const GAME_SELECTIONS = [
  {
    title: "Easy Level",
    author: "Xihe Mu",
    difficulty: "Easy (6x6)",
    description: "A gentle introduction to Sudoku logic. Perfect for beginners.",
    route: "/games/easy",
  },
  {
    title: "Normal Level",
    author: "Xihe Mu",
    difficulty: "Normal (9x9)",
    description: "A classic Sudoku board with fewer clues and a stronger challenge.",
    route: "/games/normal",
  },
];

export const RULES = [
  "Fill every empty square with a number from the allowed range for that board.",
  "Each row must contain every number exactly once with no repeats.",
  "Each column must contain every number exactly once with no repeats.",
  "Each subgrid must also contain every number exactly once.",
  "If a move breaks one of those rules, the square is highlighted in red so you can fix it.",
];

export const CREDIT_LINKS = [
  { label: "Email", href: "mailto:mu.xihe@northeastern.edu" },
  { label: "GitHub", href: "https://github.com/JunkaiDing/sudoku-project" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/xihe-mu-83640723b/" },
];

export const MOCK_SCORES = [
  { rank: "🥇 1", player: "PuzzleKing99", difficulty: "Normal", solved: "1,245" },
  { rank: "🥈 2", player: "LogicMaster", difficulty: "Normal", solved: "982" },
  { rank: "🥉 3", player: "SudokuPro", difficulty: "Normal", solved: "876" },
  { rank: "4", player: "GridWalker", difficulty: "Normal", solved: "754" },
  { rank: "5", player: "NumberCruncher", difficulty: "Easy", solved: "643" },
  { rank: "6", player: "BrainTeaser", difficulty: "Normal", solved: "521" },
  { rank: "7", player: "DailySolver", difficulty: "Easy", solved: "489" },
  { rank: "8", player: "CasualGamer", difficulty: "Easy", solved: "312" },
];
