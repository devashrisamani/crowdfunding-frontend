import { createContext, useState } from "react";

// Create the auth context that will be shared through the app
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Provider component that keeps auth state (token + user)
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token"),
    user: null, // will hold { id, username, email }
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
