import { Link } from "react-router-dom";

function GameControls({ onNewGame, onReset, modeLabel }) {
  return (
    <div className="game-controls">
      <Link to="/games" className="btn btn-secondary">
        Back to Games
      </Link>
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Reset
      </button>
      <button type="button" className="btn" onClick={onNewGame}>
        New {modeLabel} Game
      </button>
    </div>
  );
}

export default GameControls;
