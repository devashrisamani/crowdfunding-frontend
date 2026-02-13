import { handleJsonResponse } from "./handle-json-response.js";

// Deletes a fundraiser (owner only)
async function deleteFundraiser(token, fundraiserId) {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  // Some APIs return 204 with no JSON on delete; handle that gracefully
  if (response.status === 204) {
    return {};
  }

  return await handleJsonResponse(response, "Error deleting fundraiser");
}

export default deleteFundraiser;

