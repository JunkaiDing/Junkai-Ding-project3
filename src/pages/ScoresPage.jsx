import { MOCK_SCORES } from "../data/siteContent";

function ScoresPage() {
  return (
    <section>
      <h1 className="text-center mb-2">Hall of Fame</h1>
      <div className="scores-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Difficulty</th>
              <th>Solved</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SCORES.map((score) => (
              <tr key={`${score.rank}-${score.player}`}>
                <td>{score.rank}</td>
                <td>{score.player}</td>
                <td>{score.difficulty}</td>
                <td>{score.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ScoresPage;
