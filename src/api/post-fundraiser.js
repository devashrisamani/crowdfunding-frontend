import { handleJsonResponse } from "./handle-json-response.js";

// Creates a new fundraiser
async function postFundraiser(token, { title, description, image, goal, is_open }) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/`;

  const response = await fetch(url, {
    method: "POST",
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

  return await handleJsonResponse(response, "Error creating fundraiser");
}

export default postFundraiser;

