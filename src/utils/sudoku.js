import { GAME_MODE_CONFIGS } from "../data/siteContent";

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

function getValidValues(board, row, column, config) {
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

  return range(config.maxValue).map((i) => i + 1).filter((v) => !used.has(v));
}

// Counts solutions up to `limit` using backtracking (modifies board in place).
// Returns early once count reaches limit to avoid unnecessary work.
function countSolutions(board, config, limit = 2) {
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

    // Only keep the cell empty if the puzzle still has exactly one solution
    if (countSolutions(cloneBoard(puzzle), config) === 1) {
      cleared++;
    } else {
      puzzle[row][column] = savedValue;
    }
  }

  return puzzle;
}

export function getCellKey(row, column) {
  return `${row}-${column}`;
}

export function getInvalidCellKeys(board, config) {
  const invalidKeys = new Set();

  for (let row = 0; row < config.size; row += 1) {
    for (let column = 0; column < config.size; column += 1) {
      const value = board[row][column];

      if (!value) {
        continue;
      }

      for (let checkColumn = 0; checkColumn < config.size; checkColumn += 1) {
        if (checkColumn !== column && board[row][checkColumn] === value) {
          invalidKeys.add(getCellKey(row, column));
          invalidKeys.add(getCellKey(row, checkColumn));
        }
      }

      for (let checkRow = 0; checkRow < config.size; checkRow += 1) {
        if (checkRow !== row && board[checkRow][column] === value) {
          invalidKeys.add(getCellKey(row, column));
          invalidKeys.add(getCellKey(checkRow, column));
        }
      }

      const startRow = Math.floor(row / config.subRows) * config.subRows;
      const startColumn = Math.floor(column / config.subCols) * config.subCols;

      for (
        let subRow = startRow;
        subRow < startRow + config.subRows;
        subRow += 1
      ) {
        for (
          let subColumn = startColumn;
          subColumn < startColumn + config.subCols;
          subColumn += 1
        ) {
          if (
            (subRow !== row || subColumn !== column) &&
            board[subRow][subColumn] === value
          ) {
            invalidKeys.add(getCellKey(row, column));
            invalidKeys.add(getCellKey(subRow, subColumn));
          }
        }
      }
    }
  }

  return invalidKeys;
}

export function isBoardComplete(board) {
  return board.every((row) => row.every((value) => value !== 0));
}

export function createGameState(mode) {
  const config = GAME_MODE_CONFIGS[mode];
  const solution = createSolvedBoard(config);
  const initialBoard = createPuzzle(solution, config);

  return {
    mode,
    config,
    solution,
    initialBoard,
    board: cloneBoard(initialBoard),
    invalidCellKeys: [],
    selectedCell: null,
    elapsedSeconds: 0,
    status: "playing",
  };
}

export function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
