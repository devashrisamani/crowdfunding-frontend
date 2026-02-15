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

  // Prefer field-level errors (e.g. username: ["A user with that username already exists."])
  // so the user sees the real reason instead of a generic fallback
  let message = data?.detail || data?.message || data?.error;

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
    message = fallbackMessage;
  }

  if (!message) {
    if (response.status >= 500) {
      message = `Server error (${response.status}). Please try again later.`;
    } else {
      message = fallbackMessage || "Request failed";
    }
  }

  throw new Error(message);
}

