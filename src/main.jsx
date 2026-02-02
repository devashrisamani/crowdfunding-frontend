import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import FundraiserPage from "./pages/FundraiserPage";
import LandingPage from "./pages/LandingPage";
import "./main.css";

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: "/", element: <HomePage /> },
      { path: "/welcome", element: <LandingPage /> },
      { path: "/fundraiser/:id", element: <FundraiserPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={myRouter} />
  </StrictMode>,
);
