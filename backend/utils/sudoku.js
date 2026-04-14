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

function shuffle(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function range(length) {
  return Array.from({ length }, (_, index) => index);
}

function chunkedIndices(size, chunkSize) {
  const groupCount = size / chunkSize;
  return shuffle(range(groupCount)).flatMap((groupIndex) => {
    const start = groupIndex * chunkSize;
    return shuffle(range(chunkSize)).map((offset) => start + offset);
  });
}

function pattern(row, column, config) {
  return (
    (config.subCols * (row % config.subRows) +
      Math.floor(row / config.subRows) +
      column) %
    config.size
  );
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function createSolvedBoard(config) {
  const rows = chunkedIndices(config.size, config.subRows);
  const columns = chunkedIndices(config.size, config.subCols);
  const digits = shuffle(range(config.maxValue).map((value) => value + 1));
  return rows.map((rowIndex) =>
    columns.map((columnIndex) => digits[pattern(rowIndex, columnIndex, config)]),
  );
}

function getGivenCount(config) {
  if (config.givensRange) {
    const [minimum, maximum] = config.givensRange;
    return minimum + Math.floor(Math.random() * (maximum - minimum + 1));
  }
  return config.givens;
}

export function getValidValues(board, row, column, config) {
  const used = new Set();
  for (let c = 0; c < config.size; c++) {
    if (board[row][c]) used.add(board[row][c]);
  }
  for (let r = 0; r < config.size; r++) {
    if (board[r][column]) used.add(board[r][column]);
  }
  const startRow = Math.floor(row / config.subRows) * config.subRows;
  const startCol = Math.floor(column / config.subCols) * config.subCols;
  for (let r = startRow; r < startRow + config.subRows; r++) {
    for (let c = startCol; c < startCol + config.subCols; c++) {
      if (board[r][c]) used.add(board[r][c]);
    }
  }
  return range(config.maxValue)
    .map((i) => i + 1)
    .filter((v) => !used.has(v));
}

export function countSolutions(board, config, limit = 2) {
  for (let r = 0; r < config.size; r++) {
    for (let c = 0; c < config.size; c++) {
      if (board[r][c] === 0) {
        let count = 0;
        for (const value of getValidValues(board, r, c, config)) {
          board[r][c] = value;
          count += countSolutions(board, config, limit - count);
          board[r][c] = 0;
          if (count >= limit) return count;
        }
        return count;
      }
    }
  }
  return 1;
}

export function createPuzzle(solution, config) {
  const puzzle = cloneBoard(solution);
  const positions = shuffle(
    range(config.size * config.size).map((index) => ({
      row: Math.floor(index / config.size),
      column: index % config.size,
    })),
  );
  const givens = getGivenCount(config);
  const cellsToClear = config.size * config.size - givens;
  let cleared = 0;

  for (const { row, column } of positions) {
    if (cleared >= cellsToClear) break;
    const savedValue = puzzle[row][column];
    puzzle[row][column] = 0;
    if (countSolutions(cloneBoard(puzzle), config) === 1) {
      cleared++;
    } else {
      puzzle[row][column] = savedValue;
    }
  }
  return puzzle;
}

export function solvePuzzle(board, config) {
  const clone = cloneBoard(board);
  function solve(b) {
    for (let r = 0; r < config.size; r++) {
      for (let c = 0; c < config.size; c++) {
        if (b[r][c] === 0) {
          for (const v of getValidValues(b, r, c, config)) {
            b[r][c] = v;
            if (solve(b)) return true;
            b[r][c] = 0;
          }
          return false;
        }
      }
    }
    return true;
  }
  solve(clone);
  return clone;
}
