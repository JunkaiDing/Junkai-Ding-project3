import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseLinks = [
  { label: "Home", to: "/", end: true },
  { label: "Play", to: "/games" },
  { label: "Rules", to: "/rules" },
  { label: "Scores", to: "/scores" },
];

function getLinkClass({ isActive }) {
  return isActive ? "active" : "";
}

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">Sudoku Master</div>
      <ul className="nav-links">
        {baseLinks.map((link) => (
          <li key={link.to}>
            <NavLink className={getLinkClass} end={link.end} to={link.to}>
              {link.label}
            </NavLink>
          </li>
        ))}
        {isLoggedIn ? (
          <>
            <li>
              <span className="nav-username">{user.username}</span>
            </li>
            <li>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink className={getLinkClass} to="/login">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink className={getLinkClass} to="/register">
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
