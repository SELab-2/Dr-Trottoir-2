import axios from "axios";
import getAuthHeader from "@/utils/getAuthHeader";

const ApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

ApiInstance.interceptors.request.use((config) => {
  if (process.env.NEXT_PUBLIC_API_URL.includes("https:")) {
    config.url = config.url.replace("http:", "https:");
  }
  return config;
});

ApiInstance.interceptors.response.use(
  (response) => response, // Simply return the response if the status is not 403
  async (error) => {
    // If the error response is 403 (Forbidden), and we haven't already retried...
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401) &&
      !error.config.__isRetryRequest
    ) {
      error.config.__isRetryRequest = true;
      const authHeader = await getAuthHeader(); // Fetch the auth header
      error.config.headers = { ...error.config.headers, ...authHeader }; // Merge the original headers with our new ones
      ApiInstance.defaults.headers.common = {
        ...ApiInstance.defaults.headers.common,
        ...authHeader,
      }; // Save the new header for future requests
      return ApiInstance(error.config); // Retry the request
    }

    // If the error is anything else, or if we've already retried, just throw.
    return Promise.reject(error);
  }
);

export default ApiInstance;
