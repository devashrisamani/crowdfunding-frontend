import { createContext, useState } from "react";

// Create the auth context that will be shared through the app
export const AuthContext = createContext();

// Provider component that keeps auth state (currently just the token)
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token"),
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

