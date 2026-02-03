import { handleJsonResponse } from "./handle-json-response.js";

async function postLogin(username, password) {
  const url = `${import.meta.env.VITE_API_URL}/api-token-auth/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return await handleJsonResponse(response, "Error trying to login");
}

export default postLogin;
