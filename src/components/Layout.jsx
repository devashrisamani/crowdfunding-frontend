import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import "./Layout.css";

function Layout() {
  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}

export default Layout;
