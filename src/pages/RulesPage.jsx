import { CREDIT_LINKS, RULES } from "../data/siteContent";

function RulesPage() {
  return (
    <section className="rules-content">
      <h1 className="text-center">How to Play</h1>
      <p className="page-intro">
        Sudoku is a logic puzzle where every row, every column, and every
        subgrid must contain each number exactly once.
      </p>

      <ol className="rules-list">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>

      <div className="credits">
        <h3>Credits</h3>
        <p>Designed and developed by Xihe Mu and collaborators.</p>
        <div className="credits-links">
          {CREDIT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RulesPage;
