import { handleJsonResponse } from "./handle-json-response.js";

// Creates a new user account
async function postRegister({ username, password, email }) {
  const url = `${import.meta.env.VITE_API_URL}/users/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      ...(email ? { email } : {}),
    }),
  });

  return await handleJsonResponse(response, "Error trying to register");
}

export default postRegister;

