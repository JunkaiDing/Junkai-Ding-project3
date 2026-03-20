import { useGame } from "../context/GameContext";

function normalizeValue(rawValue, maxValue) {
  if (rawValue === "") {
    return 0;
  }

  const lastCharacter = rawValue.slice(-1);
  const numericValue = Number(lastCharacter);

  if (
    Number.isNaN(numericValue) ||
    numericValue < 1 ||
    numericValue > maxValue
  ) {
    return null;
  }

  return numericValue;
}

function SudokuCell({
  column,
  disabled,
  fixed,
  isHint,
  isInvalid,
  isSelected,
  row,
  showBottomBorder,
  showRightBorder,
  value,
  maxValue,
}) {
  const { selectCell, setCellValue } = useGame();
  const className = [
    "sudoku-cell",
    fixed ? "fixed" : "",
    isSelected ? "selected" : "",
    isHint ? "hint" : "",
    isInvalid ? "invalid" : "",
    showRightBorder ? "subgrid-right" : "",
    showBottomBorder ? "subgrid-bottom" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      autoComplete="off"
      aria-label={`Row ${row + 1} Column ${column + 1}`}
      className={className}
      disabled={fixed || disabled}
      inputMode="numeric"
      maxLength={1}
      onChange={(event) => {
        const nextValue = normalizeValue(event.target.value, maxValue);

        if (nextValue === null) {
          return;
        }

        setCellValue(row, column, nextValue);
      }}
      onClick={() => selectCell(row, column)}
      onFocus={() => selectCell(row, column)}
      onKeyDown={(event) => {
        if (event.key === "Backspace" || event.key === "Delete") {
          event.preventDefault();
          setCellValue(row, column, 0);
          return;
        }

        if (event.key.length !== 1) {
          return;
        }

        const pressedValue = Number(event.key);

        if (
          Number.isNaN(pressedValue) ||
          pressedValue < 1 ||
          pressedValue > maxValue
        ) {
          event.preventDefault();
        }
      }}
      spellCheck={false}
      type="text"
      value={value === 0 ? "" : value}
    />
  );
}

export default SudokuCell;
