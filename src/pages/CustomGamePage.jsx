import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import SudokuBoard from "../components/SudokuBoard";
import { useAuth } from "../context/AuthContext";
import { submitCustomGame } from "../utils/api";
import { GAME_MODE_CONFIGS } from "../data/siteContent";
import { cloneBoard, getInvalidCellKeys, getCellKey } from "../utils/sudoku";

const config = GAME_MODE_CONFIGS.normal;

function createEmptyBoard() {
  return Array.from({ length: config.size }, () =>
    Array.from({ length: config.size }, () => 0),
  );
}

function CustomGamePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState(createEmptyBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const invalidCellKeys = [...getInvalidCellKeys(board, config)];

  const handleCellChange = useCallback((row, column, value) => {
    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][column] = value;
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await submitCustomGame(board);
      navigate(`/game/${res.data.gameId}`);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to create custom game. Make sure the board has exactly one unique solution.",
      );
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBoard(createEmptyBoard());
    setSelectedCell(null);
    setError("");
  };

  if (!isLoggedIn) {
    return (
      <section className="text-center">
        <h1>Custom Game</h1>
        <p>You must be logged in to create a custom game.</p>
      </section>
    );
  }

  return (
    <section className="game-page">
      <div className="game-header">
        <div>
          <h1>Create Custom Game</h1>
          <p className="game-subtitle">
            Fill in numbers to create a Sudoku puzzle. The puzzle must have
            exactly one unique solution. Leave cells empty (0) for the player to
            fill.
          </p>
        </div>
      </div>

      {error && <p className="auth-error text-center">{error}</p>}

      <div className="game-board-card">
        <CustomBoard
          board={board}
          config={config}
          invalidCellKeys={invalidCellKeys}
          selectedCell={selectedCell}
          onSelectCell={setSelectedCell}
          onCellChange={handleCellChange}
        />
      </div>

      <div className="game-controls">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/games")}
        >
          Back to Games
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleReset}
        >
          Clear Board
        </button>
        <button
          type="button"
          className="btn"
          disabled={submitting || invalidCellKeys.length > 0}
          onClick={handleSubmit}
        >
          {submitting ? "Validating..." : "Submit"}
        </button>
      </div>
    </section>
  );
}

// A simplified board component for custom game creation
// All cells are editable, no "fixed" cells
function CustomBoard({ board, config, invalidCellKeys, selectedCell, onSelectCell, onCellChange }) {
  return (
    <div
      className={`sudoku-grid sudoku-grid-${config.mode}`}
      style={{ gridTemplateColumns: `repeat(${config.size}, 1fr)` }}
    >
      {board.map((row, rowIndex) =>
        row.map((value, columnIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex &&
            selectedCell?.column === columnIndex;
          const isInvalid = invalidCellKeys.includes(
            getCellKey(rowIndex, columnIndex),
          );

          const className = [
            "sudoku-cell",
            isSelected ? "selected" : "",
            isInvalid ? "invalid" : "",
            (columnIndex + 1) % config.subCols === 0 &&
            columnIndex !== config.size - 1
              ? "subgrid-right"
              : "",
            (rowIndex + 1) % config.subRows === 0 &&
            rowIndex !== config.size - 1
              ? "subgrid-bottom"
              : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <input
              key={`${rowIndex}-${columnIndex}`}
              autoComplete="off"
              aria-label={`Row ${rowIndex + 1} Column ${columnIndex + 1}`}
              className={className}
              inputMode="numeric"
              maxLength={1}
              type="text"
              value={value === 0 ? "" : value}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  onCellChange(rowIndex, columnIndex, 0);
                  return;
                }
                const lastChar = raw.slice(-1);
                const num = Number(lastChar);
                if (!Number.isNaN(num) && num >= 1 && num <= config.maxValue) {
                  onCellChange(rowIndex, columnIndex, num);
                }
              }}
              onClick={() =>
                onSelectCell({ row: rowIndex, column: columnIndex })
              }
              onFocus={() =>
                onSelectCell({ row: rowIndex, column: columnIndex })
              }
              onKeyDown={(e) => {
                if (e.key === "Backspace" || e.key === "Delete") {
                  e.preventDefault();
                  onCellChange(rowIndex, columnIndex, 0);
                }
              }}
              spellCheck={false}
            />
          );
        }),
      )}
    </div>
  );
}

export default CustomGamePage;
