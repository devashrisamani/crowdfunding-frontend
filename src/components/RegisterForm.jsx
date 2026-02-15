import { useState } from "react";
import { useNavigate } from "react-router-dom";

import postRegister from "../api/post-register.js";
import useAuth from "../hooks/use-auth.js";

function RegisterForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username || !form.password) {
      setErrorMessage("Please enter a username and password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await postRegister({
        username: form.username,
        password: form.password,
        email: form.email || undefined,
      });

      // If API returns a token, stay; otherwise send user to login.
      if (response?.token) {
        window.localStorage.setItem("token", response.token);
        setAuth({ token: response.token });
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg = err.message ?? "Registration failed";
      if (msg === "Error trying to register" || msg === "Registration failed") {
        setErrorMessage(
          "Registration failed. Common reasons: this username or email is already in use, or the password doesn’t meet the requirements. Please try again.",
        );
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <div className="card">
        <div className="page-header">
          <h2>Create an account</h2>
          <p className="text-muted">
            Join Leaf a Mark to start fundraisers and support projects.
          </p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email (optional)</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {errorMessage && <p className="text-error">{errorMessage}</p>}

          <div className="form-actions">
            <button className="button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;

