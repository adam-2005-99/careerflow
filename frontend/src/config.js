// Use the configured API URL in production, with the local FastAPI server as a development fallback.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";