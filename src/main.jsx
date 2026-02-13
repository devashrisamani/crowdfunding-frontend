import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import FundraiserPage from "./pages/FundraiserPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import EditFundraiserPage from "./pages/EditFundraiserPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import "./main.css";

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: "/", element: <HomePage /> },
      { path: "/welcome", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: "/fundraiser/:id", element: <FundraiserPage /> },
      {
        path: "/fundraiser/:id/edit",
        element: (
          <ProtectedRoute>
            <EditFundraiserPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={myRouter} />
    </AuthProvider>
  </StrictMode>,
);
