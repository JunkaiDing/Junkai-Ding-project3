import { Link } from "react-router-dom";

function GameControls({ onReset, onHint, onDelete, canDelete, disabled }) {
  return (
    <div className="game-controls">
      <Link to="/games" className="btn btn-secondary">
        Back to Games
      </Link>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onReset}
        disabled={disabled}
      >
        Reset
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onHint}
        disabled={disabled}
      >
        Hint
      </button>
      {canDelete && (
        <button type="button" className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
}

export default GameControls;
