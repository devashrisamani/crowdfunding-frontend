import { handleJsonResponse } from "./handle-json-response.js";

async function getMyPledges(token) {
  const url = `${import.meta.env.VITE_API_URL}/me/pledges/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  return await handleJsonResponse(response, "Error fetching your pledges");
}

export default getMyPledges;
