import { Outlet, Link, NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <div>
      <nav className="nav">
        {/* Logo / Home link (existing, unchanged) */}
        <Link to="/" className="nav-logo">
          Leaf a Mark
        </Link>

        {/* New menu items (added, not replacing anything) */}
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Create Fundraiser
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Register
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
