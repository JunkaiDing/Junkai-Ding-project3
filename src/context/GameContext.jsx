import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  cloneBoard,
  createGameState,
  getCellKey,
  getInvalidCellKeys,
  isBoardComplete,
} from "../utils/sudoku";
import { GAME_MODE_CONFIGS } from "../data/siteContent";

const GameContext = createContext(null);

const STORAGE_KEY = "sudoku-game-state";

const ACTIONS = {
  reset: "reset",
  selectCell: "select-cell",
  setCellValue: "set-cell-value",
  startGame: "start-game",
  tick: "tick",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.startGame:
      return createGameState(action.mode);
    case ACTIONS.reset:
      return {
        ...state,
        board: cloneBoard(state.initialBoard),
        invalidCellKeys: [],
        selectedCell: null,
        elapsedSeconds: 0,
        status: "playing",
      };
    case ACTIONS.selectCell:
      return {
        ...state,
        selectedCell: action.payload,
      };
    case ACTIONS.setCellValue: {
      const { row, column, value } = action.payload;

      if (state.status === "won" || state.initialBoard[row][column] !== 0) {
        return state;
      }

      const nextBoard = cloneBoard(state.board);
      nextBoard[row][column] = value;

      const invalidCellKeys = [...getInvalidCellKeys(nextBoard, state.config)];
      const isWon =
        invalidCellKeys.length === 0 && isBoardComplete(nextBoard);

      return {
        ...state,
        board: nextBoard,
        invalidCellKeys,
        status: isWon ? "won" : "playing",
      };
    }
    case ACTIONS.tick:
      if (state.status !== "playing") {
        return state;
      }

      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, selectedCell: null };
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    return {
      mode: "easy",
      config: GAME_MODE_CONFIGS.easy,
      solution: [],
      initialBoard: [],
      board: [],
      invalidCellKeys: [],
      selectedCell: null,
      elapsedSeconds: 0,
      status: "idle",
    };
  });

  useEffect(() => {
    if (state.status === "won") {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    if (state.status === "playing") {
      const { selectedCell: _sel, ...stateToSave } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [state]);

  useEffect(() => {
    if (state.status !== "playing") {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      dispatch({ type: ACTIONS.tick });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [state.status]);

  const startGame = useCallback((mode) => {
    dispatch({ type: ACTIONS.startGame, mode });
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ACTIONS.reset });
  }, []);

  const selectCell = useCallback((row, column) => {
    dispatch({
      type: ACTIONS.selectCell,
      payload: { row, column },
    });
  }, []);

  const setCellValue = useCallback((row, column, value) => {
    dispatch({
      type: ACTIONS.setCellValue,
      payload: { row, column, value },
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      getIsFixed: (row, column) => state.initialBoard[row][column] !== 0,
      getIsInvalid: (row, column) =>
        state.invalidCellKeys.includes(getCellKey(row, column)),
      resetGame,
      selectCell,
      setCellValue,
      startGame,
    }),
    [resetGame, selectCell, setCellValue, startGame, state],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }

  return context;
}
