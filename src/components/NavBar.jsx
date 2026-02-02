import { Outlet, Link } from "react-router-dom";
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
          <Link to="/">Home</Link>
          <Link to="/create">Create Fundraiser</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
