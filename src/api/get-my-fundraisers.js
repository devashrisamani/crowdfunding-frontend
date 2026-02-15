import { handleJsonResponse } from "./handle-json-response.js";

async function getMyFundraisers(token) {
  const url = `${import.meta.env.VITE_API_URL}/me/fundraisers/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  return await handleJsonResponse(response, "Error fetching your fundraisers");
}

export default getMyFundraisers;
