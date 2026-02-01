import { Outlet, Link } from "react-router-dom";

function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}

export default NavBar;
