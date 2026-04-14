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
  getCellKey,
  getInvalidCellKeys,
  isBoardComplete,
} from "../utils/sudoku";

const GameContext = createContext(null);

const ACTIONS = {
  loadGame: "load-game",
  reset: "reset",
  selectCell: "select-cell",
  setCellValue: "set-cell-value",
  tick: "tick",
};

const INITIAL_STATE = {
  gameId: null,
  mode: null,
  config: null,
  initialBoard: [],
  board: [],
  invalidCellKeys: [],
  selectedCell: null,
  elapsedSeconds: 0,
  status: "idle",
  createdBy: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.loadGame: {
      const data = action.payload;
      return {
        gameId: data._id,
        mode: data.difficulty?.toLowerCase(),
        config: data.config,
        initialBoard: data.initialBoard,
        board: data.board,
        invalidCellKeys: [
          ...getInvalidCellKeys(data.board, data.config),
        ],
        selectedCell: null,
        elapsedSeconds: 0,
        status: data.status,
        createdBy: data.createdBy,
      };
    }
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
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (state.status !== "playing") {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      dispatch({ type: ACTIONS.tick });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [state.status]);

  const loadGame = useCallback((gameData) => {
    dispatch({ type: ACTIONS.loadGame, payload: gameData });
  }, []);

  const resetGame = useCallback(() => {
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
      getIsFixed: (row, column) =>
        state.initialBoard?.[row]?.[column] !== 0,
      getIsInvalid: (row, column) =>
        state.invalidCellKeys.includes(getCellKey(row, column)),
      loadGame,
      resetGame,
      selectCell,
      setCellValue,
    }),
    [loadGame, resetGame, selectCell, setCellValue, state],
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
