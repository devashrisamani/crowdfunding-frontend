import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <Link to="/" className="app-footer-logo">
          Leaf a Mark
        </Link>
        <p className="app-footer-tagline">
          Crowdfunding for sustainability and community projects.
        </p>
        <nav className="app-footer-links">
          <Link to="/">Fundraisers</Link>
          <Link to="/create">Create</Link>
          <Link to="/welcome">About</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </nav>
        <p className="app-footer-copy">&copy; Leaf a Mark</p>
      </div>
    </footer>
  );
}

export default Footer;
