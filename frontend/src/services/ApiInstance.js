import axios from "axios";
import getAuthHeader from "@/utils/getAuthHeader";

class ApiInstance {
  getApi(contentType = "application/json") {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": contentType,
      },
    });

    instance.interceptors.request.use(async (config) => {
      config.headers = { ...config.headers, ...(await getAuthHeader()) };
      return config;
    });

    return instance;
  }
}

export default new ApiInstance();
