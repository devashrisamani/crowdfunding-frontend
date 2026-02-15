// Fetch all fundraisers from the API.
async function getFundraisers() {
  const url = `${import.meta.env.VITE_API_URL}/fundraisers/`;
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    const fallbackError = "Error fetching fundraisers";
    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });
    // Use server error message when available (e.g. data.detail).
    const errorMessage = data?.detail ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default getFundraisers;
