export function cloneBoard(board) {
  return board.map((row) => [...row]);
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

export function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
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
  return Array.from({ length: config.maxValue }, (_, i) => i + 1).filter(
    (v) => !used.has(v),
  );
}
