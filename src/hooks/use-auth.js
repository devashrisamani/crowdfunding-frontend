import { useContext } from "react";

import { AuthContext } from "../components/AuthProvider.jsx";

// Simple helper hook to access auth context
export default function useAuth() {
  return useContext(AuthContext);
}

