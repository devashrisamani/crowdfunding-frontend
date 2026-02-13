import { handleJsonResponse } from "./handle-json-response.js";

// Updates an existing fundraiser (owner only)
async function putFundraiser(token, fundraiserId, { title, description, image, goal, is_open }) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      image,
      goal,
      is_open,
    }),
  });

  return await handleJsonResponse(response, "Error updating fundraiser");
}

export default putFundraiser;

