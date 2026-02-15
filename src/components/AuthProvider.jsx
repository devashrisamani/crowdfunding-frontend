import { createContext, useEffect, useState } from "react";
import getCurrentUser from "../api/get-current-user.js";

// Create the auth context that will be shared through the app
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Provider component that keeps auth state (token + user)
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token"),
    user: null, // will hold { id, username, email }
  });

  // When there is a token but no user (e.g. after page refresh), fetch the current user
  useEffect(() => {
    if (!auth.token || auth.user) return;

    getCurrentUser(auth.token)
      .then((user) => {
        setAuth((prev) => ({ ...prev, user }));
      })
      .catch(() => {
        // If the token is invalid, clear it out
        window.localStorage.removeItem("token");
        setAuth({ token: null, user: null });
      });
  }, [auth.token, auth.user]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
