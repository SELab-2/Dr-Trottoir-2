export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api/"
    : "https://sel2-2.ugent.be/api/";
