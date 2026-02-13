import { handleJsonResponse } from "./handle-json-response.js";

// Updates an existing pledge (supporter only)
async function putPledge(token, pledgeId, { comment, anonymous }) {
  const url = `${import.meta.env.VITE_API_URL}/pledges/${pledgeId}/`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      comment,
      anonymous,
    }),
  });

  return await handleJsonResponse(response, "Error updating pledge");
}

export default putPledge;

