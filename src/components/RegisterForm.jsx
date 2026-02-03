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

      // If your API returns a token on registration, store it; otherwise redirect to login
      if (response?.token) {
        window.localStorage.setItem("token", response.token);
        setAuth({ token: response.token });
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setErrorMessage(err.message ?? "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email (optional):</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}

export default RegisterForm;

