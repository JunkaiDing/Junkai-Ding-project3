import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import GamePage from "./pages/GamePage";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RulesPage from "./pages/RulesPage";
import ScoresPage from "./pages/ScoresPage";

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/easy" element={<GamePage mode="easy" />} />
          <Route path="/games/normal" element={<GamePage mode="normal" />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
