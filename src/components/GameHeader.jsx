import { formatElapsedTime } from "../utils/sudoku";

function GameHeader({ title, subtitle, status, elapsedSeconds }) {
  return (
    <div className="game-header">
      <div>
        <h1>{title}</h1>
        <p className="game-subtitle">{subtitle}</p>
      </div>
      <div className="game-header-side">
        <div className="timer">{formatElapsedTime(elapsedSeconds)}</div>
        {status === "won" ? (
          <div className="status-banner success">Congratulations! Puzzle solved.</div>
        ) : (
          <div className="status-banner">Fill each row, column, and box exactly once.</div>
        )}
      </div>
    </div>
  );
}

export default GameHeader;
