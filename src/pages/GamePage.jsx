import { useEffect } from "react";
import GameControls from "../components/GameControls";
import GameHeader from "../components/GameHeader";
import SudokuBoard from "../components/SudokuBoard";
import { GAME_MODE_CONFIGS } from "../data/siteContent";
import { useGame } from "../context/GameContext";

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

  useEffect(() => {
    if (status === "playing" && config.mode === mode) {
      return;
    }
    startGame(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

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
          getIsInvalid={getIsInvalid}
          selectedCell={selectedCell}
        />
      </div>

      <GameControls
        modeLabel={pageConfig.title.replace(" Level", "")}
        onNewGame={() => startGame(mode)}
        onReset={resetGame}
      />
    </section>
  );
}

export default GamePage;
