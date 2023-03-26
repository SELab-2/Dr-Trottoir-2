export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api/"
    : "/api/";
