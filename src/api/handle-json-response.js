// Helper to turn a fetch Response into data or a useful Error
export async function handleJsonResponse(response, fallbackMessage) {
  if (response.ok) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  const data = await response.json().catch(() => null);
  const message =
    data?.detail ||
    data?.message ||
    data?.error ||
    fallbackMessage ||
    "Request failed";

  throw new Error(message);
}

