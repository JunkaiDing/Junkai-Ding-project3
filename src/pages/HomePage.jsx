import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="hero">
      <div className="hero-icon">#</div>
      <h1>Welcome to Sudoku Master</h1>
      <p className="hero-copy">
        Challenge your mind with classic number puzzles, race against the
        timer, and switch between easy and normal game modes.
      </p>
      <div className="hero-actions">
        <Link to="/games" className="btn">
          Start Playing
        </Link>
        <Link to="/rules" className="btn btn-secondary">
          Read the Rules
        </Link>
      </div>

      <div className="features">
        <article className="feature-card">
          <h3>Classic Gameplay</h3>
          <p>Play a 6x6 beginner board or step up to the classic 9x9 challenge.</p>
        </article>
        <article className="feature-card">
          <h3>Responsive Layout</h3>
          <p>The board and controls stay comfortable on desktop and mobile screens.</p>
        </article>
        <article className="feature-card">
          <h3>Instant Feedback</h3>
          <p>Incorrect moves turn red right away so you can fix them as you play.</p>
        </article>
      </div>
    </section>
  );
}

export default HomePage;
