import { Link } from "react-router-dom";
import { GAME_SELECTIONS } from "../data/siteContent";

function GamesPage() {
  return (
    <section>
      <h1 className="text-center">Select a Game</h1>
      <p className="text-center page-intro">
        Choose a board and start a fresh Sudoku puzzle.
      </p>

      <div className="selection-grid">
        {GAME_SELECTIONS.map((game) => (
          <article key={game.route} className="card game-card">
            <div>
              <span
                className={`difficulty-badge ${
                  game.route.endsWith("easy") ? "badge-easy" : "badge-normal"
                }`}
              >
                {game.difficulty}
              </span>
              <h3>{game.title}</h3>
              <p className="game-author">By {game.author}</p>
              <p>{game.description}</p>
            </div>
            <Link to={game.route} className="btn mt-1">
              Play Now
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default GamesPage;
