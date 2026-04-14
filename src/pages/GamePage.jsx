import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GameControls from "../components/GameControls";
import GameHeader from "../components/GameHeader";
import SudokuBoard from "../components/SudokuBoard";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { getGame, updateGame, recordWin, deleteGame } from "../utils/api";
import { getValidValues } from "../utils/sudoku";

function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const {
    board,
    config,
    elapsedSeconds,
    gameId: loadedGameId,
    getIsFixed,
    getIsInvalid,
    loadGame,
    resetGame,
    selectedCell,
    status,
    createdBy,
  } = useGame();

  const [hintCell, setHintCell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasRecordedWin = useRef(false);

  // Fetch game from backend
  useEffect(() => {
    setLoading(true);
    setError("");
    hasRecordedWin.current = false;
    getGame(gameId)
      .then((res) => {
        loadGame(res.data);
      })
      .catch(() => {
        setError("Game not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gameId, loadGame]);

  // Debounced save to backend
  useEffect(() => {
    if (loadedGameId !== gameId || status !== "playing" || !isLoggedIn) return;
    const timer = setTimeout(() => {
      updateGame(gameId, { board }).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [board, gameId, loadedGameId, status, isLoggedIn]);

  // Record win
  useEffect(() => {
    if (status === "won" && isLoggedIn && !hasRecordedWin.current) {
      hasRecordedWin.current = true;
      updateGame(gameId, { board, status: "won" }).catch(() => {});
      recordWin(gameId).catch(() => {});
    }
  }, [status, gameId, board, isLoggedIn]);

  // Clear hint when board changes
  useEffect(() => {
    setHintCell(null);
  }, [board]);

  const handleHint = useCallback(() => {
    if (status !== "playing" || !board || board.length === 0) return;
    const candidates = [];
    for (let r = 0; r < config.size; r++) {
      for (let c = 0; c < config.size; c++) {
        if (
          board[r][c] === 0 &&
          getValidValues(board, r, c, config).length === 1
        ) {
          candidates.push({ row: r, column: c });
        }
      }
    }
    if (candidates.length === 0) return;
    setHintCell(candidates[Math.floor(Math.random() * candidates.length)]);
  }, [board, config, status]);

  const getIsHint = useCallback(
    (row, column) => hintCell?.row === row && hintCell?.column === column,
    [hintCell],
  );

  const handleReset = useCallback(() => {
    resetGame();
    if (isLoggedIn) {
      getGame(gameId).then((res) => {
        updateGame(gameId, { board: res.data.initialBoard, status: "playing" }).catch(() => {});
      }).catch(() => {});
    }
  }, [resetGame, gameId, isLoggedIn]);

  const handleDelete = async () => {
    try {
      await deleteGame(gameId);
      navigate("/games");
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <p className="text-center">Loading puzzle...</p>;
  }

  if (error) {
    return <p className="text-center auth-error">{error}</p>;
  }

  if (!config || board.length === 0) {
    return <p className="text-center">Loading puzzle...</p>;
  }

  const canInteract = isLoggedIn && status !== "won";
  const canDelete = isLoggedIn && user?.username === createdBy;

  return (
    <section className="game-page">
      <GameHeader
        elapsedSeconds={elapsedSeconds}
        status={status}
        subtitle={`${config.size}x${config.size} Sudoku`}
        title={config.title || `${config.mode?.charAt(0).toUpperCase()}${config.mode?.slice(1)} Level`}
      />

      <div className="game-board-card">
        <SudokuBoard
          board={board}
          config={config}
          disabled={!canInteract}
          getIsFixed={getIsFixed}
          getIsHint={getIsHint}
          getIsInvalid={getIsInvalid}
          selectedCell={selectedCell}
        />
      </div>

      <GameControls
        onReset={handleReset}
        onHint={handleHint}
        onDelete={handleDelete}
        canDelete={canDelete}
        disabled={!canInteract}
      />
    </section>
  );
}

export default GamePage;
