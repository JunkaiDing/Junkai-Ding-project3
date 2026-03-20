import SudokuCell from "./SudokuCell";

function SudokuBoard({
  board,
  config,
  disabled,
  getIsFixed,
  getIsHint,
  getIsInvalid,
  selectedCell,
}) {
  return (
    <div
      className={`sudoku-grid sudoku-grid-${config.mode}`}
      style={{ gridTemplateColumns: `repeat(${config.size}, 1fr)` }}
    >
      {board.map((row, rowIndex) =>
        row.map((value, columnIndex) => (
          <SudokuCell
            key={`${rowIndex}-${columnIndex}`}
            column={columnIndex}
            disabled={disabled}
            fixed={getIsFixed(rowIndex, columnIndex)}
            isHint={getIsHint(rowIndex, columnIndex)}
            isInvalid={getIsInvalid(rowIndex, columnIndex)}
            isSelected={
              selectedCell?.row === rowIndex &&
              selectedCell?.column === columnIndex
            }
            maxValue={config.maxValue}
            row={rowIndex}
            showBottomBorder={
              (rowIndex + 1) % config.subRows === 0 &&
              rowIndex !== config.size - 1
            }
            showRightBorder={
              (columnIndex + 1) % config.subCols === 0 &&
              columnIndex !== config.size - 1
            }
            value={value}
          />
        )),
      )}
    </div>
  );
}

export default SudokuBoard;
