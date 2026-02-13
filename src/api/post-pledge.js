import { handleJsonResponse } from "./handle-json-response.js";

// Creates a new pledge for a fundraiser
async function postPledge(token, { fundraiserId, amount, comment, anonymous }) {
  const url = `${import.meta.env.VITE_API_URL}/pledges/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      amount,
      comment,
      anonymous,
      fundraiser: fundraiserId,
    }),
  });

  return await handleJsonResponse(response, "Error creating pledge");
}

export default postPledge;

