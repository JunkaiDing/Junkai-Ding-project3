import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/", end: true },
  { label: "Play", to: "/games" },
  { label: "Rules", to: "/rules" },
  { label: "Scores", to: "/scores" },
  { label: "Login", to: "/login" },
];

function getLinkClass({ isActive }) {
  return isActive ? "active" : "";
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">Sudoku Master</div>
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink className={getLinkClass} end={link.end} to={link.to}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
