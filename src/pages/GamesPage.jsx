import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGames, createGame, deleteGame } from "../utils/api";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getGames()
      .then((res) => setGames(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (difficulty) => {
    setCreating(true);
    try {
      const res = await createGame(difficulty);
      navigate(`/game/${res.data.gameId}`);
    } catch {
      setCreating(false);
    }
  };

  const handleDelete = async (gameId) => {
    try {
      await deleteGame(gameId);
      setGames((prev) => prev.filter((g) => g._id !== gameId));
    } catch {
      // ignore
    }
  };

  return (
    <section>
      <h1 className="text-center">Games</h1>
      <p className="text-center page-intro">
        Create a new game or select an existing one to play.
      </p>

      {isLoggedIn && (
        <div className="create-buttons">
          <button
            className="btn"
            disabled={creating}
            onClick={() => handleCreate("EASY")}
          >
            Create Easy Game
          </button>
          <button
            className="btn"
            disabled={creating}
            onClick={() => handleCreate("NORMAL")}
          >
            Create Normal Game
          </button>
          <Link to="/custom" className="btn btn-secondary">
            Create Custom Game
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="text-center">No games yet. Create one to get started!</p>
      ) : (
        <div className="games-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Difficulty</th>
                <th>Created By</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>
                    <Link to={`/game/${game._id}`} className="game-link">
                      {game.name}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`difficulty-badge badge-${game.difficulty.toLowerCase()}`}
                    >
                      {game.difficulty}
                    </span>
                  </td>
                  <td>{game.createdBy}</td>
                  <td>{formatDate(game.createdAt)}</td>
                  <td>
                    <span
                      className={`status-pill ${game.status === "won" ? "status-won" : "status-playing"}`}
                    >
                      {game.status === "won" ? "Completed" : "In Progress"}
                    </span>
                  </td>
                  <td>
                    {isLoggedIn && user.username === game.createdBy && (
                      <button
                        className="btn-danger-sm"
                        onClick={() => handleDelete(game._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default GamesPage;
