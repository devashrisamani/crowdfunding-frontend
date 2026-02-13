import { handleJsonResponse } from "./handle-json-response.js";

// Fetches the currently authenticated user's profile
async function getCurrentUser(token) {
  const url = `${import.meta.env.VITE_API_URL}/users/me/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  return await handleJsonResponse(response, "Error fetching profile");
}

export default getCurrentUser;
