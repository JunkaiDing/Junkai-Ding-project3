import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

// Auth
export const checkAuth = () => api.get("/api/user/isLoggedIn");
export const login = (username, password) =>
  api.post("/api/user/login", { username, password });
export const register = (username, password) =>
  api.post("/api/user/register", { username, password });
export const logout = () => api.post("/api/logout");

// Games
export const getGames = () => api.get("/api/sudoku");
export const getGame = (gameId) => api.get(`/api/sudoku/${gameId}`);
export const createGame = (difficulty) =>
  api.post("/api/sudoku", { difficulty });
export const updateGame = (gameId, data) =>
  api.put(`/api/sudoku/${gameId}`, data);
export const deleteGame = (gameId) => api.delete(`/api/sudoku/${gameId}`);

// Custom games
export const submitCustomGame = (board) =>
  api.post("/api/sudoku/custom", { board });

// Highscores
export const getHighscores = () => api.get("/api/highscore");
export const recordWin = (gameId) => api.post("/api/highscore", { gameId });
export const getGameHighscore = (gameId) =>
  api.get(`/api/highscore/${gameId}`);
