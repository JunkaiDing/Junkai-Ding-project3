import { useEffect, useState } from "react";
import { getHighscores } from "../utils/api";

function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHighscores()
      .then((res) => setScores(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h1 className="text-center mb-2">Hall of Fame</h1>
      <div className="scores-container">
        {loading ? (
          <p className="text-center">Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className="text-center">No winners yet. Be the first!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.username}>
                  <td>{index + 1}</td>
                  <td>{score.username}</td>
                  <td>{score.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default ScoresPage;
