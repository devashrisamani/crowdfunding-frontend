import { useState } from "react";
import postLogin from "../api/post-login.js";
import getCurrentUser from "../api/get-current-user.js";
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
      // 1) Login and get token
      const response = await postLogin(
        credentials.username,
        credentials.password,
      );

      const token = response.token;
      window.localStorage.setItem("token", token);

      // 2) Fetch current user details using the token
      const user = await getCurrentUser(token);
      // user should look like: { id, username, email, ... }

      // 3) Store both token and user in auth context
      setAuth({ token, user });

      // 4) Redirect to home (or wherever you like)
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message ?? "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <div className="card">
        <div className="page-header">
          <h2>Log in</h2>
          <p className="text-muted">
            Access your account to create and support fundraisers.
          </p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          {errorMessage && <p className="text-error">{errorMessage}</p>}

          <div className="form-actions">
            <button className="button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
