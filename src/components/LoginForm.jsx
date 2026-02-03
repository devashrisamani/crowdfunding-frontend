import { useState } from "react";
import postLogin from "../api/post-login.js";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/use-auth.js";

function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!credentials.username || !credentials.password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await postLogin(
        credentials.username,
        credentials.password,
      );
      window.localStorage.setItem("token", response.token);
      setAuth({ token: response.token });
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message ?? "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={credentials.username}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}

export default LoginForm;
