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

  // Try to build a useful error message from common API response shapes
  let message =
    data?.detail || data?.message || data?.error || fallbackMessage;

  // If there are field-level validation errors (e.g. { title: ["This field is required."] })
  if (!message && data && typeof data === "object") {
    const parts = Object.entries(data).map(([field, value]) => {
      if (Array.isArray(value)) {
        return `${field}: ${value.join(", ")}`;
      }
      if (typeof value === "string") {
        return `${field}: ${value}`;
      }
      return `${field}: ${JSON.stringify(value)}`;
    });

    if (parts.length > 0) {
      message = parts.join(" | ");
    }
  }

  if (!message) {
    if (response.status >= 500) {
      message = `Server error (${response.status}). Please try again later.`;
    } else {
      message = "Request failed";
    }
  }

  throw new Error(message);
}

