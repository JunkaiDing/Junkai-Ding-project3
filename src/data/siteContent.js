export const GAME_MODE_CONFIGS = {
  easy: {
    mode: "easy",
    title: "Easy Level",
    size: 6,
    subRows: 2,
    subCols: 3,
    maxValue: 6,
    givens: 18,
  },
  normal: {
    mode: "normal",
    title: "Normal Level",
    size: 9,
    subRows: 3,
    subCols: 3,
    maxValue: 9,
    givensRange: [28, 30],
  },
};

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
