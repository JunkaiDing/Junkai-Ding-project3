import { useCallback, useEffect, useState } from "react";
import GameControls from "../components/GameControls";
import GameHeader from "../components/GameHeader";
import SudokuBoard from "../components/SudokuBoard";
import { GAME_MODE_CONFIGS } from "../data/siteContent";
import { useGame } from "../context/GameContext";

function getValidValues(board, row, column, config) {
  const used = new Set();
  for (let c = 0; c < config.size; c++) if (board[row][c]) used.add(board[row][c]);
  for (let r = 0; r < config.size; r++) if (board[r][column]) used.add(board[r][column]);
  const startRow = Math.floor(row / config.subRows) * config.subRows;
  const startCol = Math.floor(column / config.subCols) * config.subCols;
  for (let r = startRow; r < startRow + config.subRows; r++)
    for (let c = startCol; c < startCol + config.subCols; c++)
      if (board[r][c]) used.add(board[r][c]);
  return Array.from({ length: config.maxValue }, (_, i) => i + 1).filter((v) => !used.has(v));
}

function GamePage({ mode }) {
  const {
    board,
    config,
    elapsedSeconds,
    getIsFixed,
    getIsInvalid,
    resetGame,
    selectedCell,
    startGame,
    status,
  } = useGame();

  const [hintCell, setHintCell] = useState(null);

  useEffect(() => {
    if (status === "playing" && config.mode === mode) {
      return;
    }
    startGame(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    setHintCell(null);
  }, [board]);

  const handleHint = useCallback(() => {
    if (status !== "playing" || board.length === 0) return;
    const candidates = [];
    for (let r = 0; r < config.size; r++) {
      for (let c = 0; c < config.size; c++) {
        if (board[r][c] === 0 && getValidValues(board, r, c, config).length === 1) {
          candidates.push({ row: r, column: c });
        }
      }
    }
    if (candidates.length === 0) return;
    setHintCell(candidates[Math.floor(Math.random() * candidates.length)]);
  }, [board, config, status]);

  const getIsHint = useCallback(
    (row, column) => hintCell?.row === row && hintCell?.column === column,
    [hintCell],
  );

  const pageConfig = GAME_MODE_CONFIGS[mode];

  if (config.mode !== mode || board.length === 0) {
    return <p>Loading puzzle...</p>;
  }

  return (
    <section className="game-page">
      <GameHeader
        elapsedSeconds={elapsedSeconds}
        status={status}
        subtitle={pageConfig.description}
        title={pageConfig.title}
      />

      <div className="game-board-card">
        <SudokuBoard
          board={board}
          config={config}
          disabled={status === "won"}
          getIsFixed={getIsFixed}
          getIsHint={getIsHint}
          getIsInvalid={getIsInvalid}
          selectedCell={selectedCell}
        />
      </div>

      <GameControls
        modeLabel={pageConfig.title.replace(" Level", "")}
        onHint={handleHint}
        onNewGame={() => startGame(mode)}
        onReset={resetGame}
      />
    </section>
  );
}

export default GamePage;
