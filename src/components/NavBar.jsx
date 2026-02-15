import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    setAuth({ token: null, user: null });
    navigate("/login");
  };

  return (
    <div>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          Leaf a Mark
        </Link>

        <div className="nav-links">
          <NavLink to="/welcome" className="nav-link">
            About
          </NavLink>
          <NavLink to="/" className="nav-link">
            Fundraisers
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Start a fundraiser
          </NavLink>
          {auth?.token ? (
            <>
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
              <button type="button" className="nav-link" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
              <NavLink to="/register" className="nav-link nav-cta">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
