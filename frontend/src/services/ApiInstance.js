import axios from "axios";
import getAuthHeader from "@/utils/getAuthHeader";

class ApiInstance {
  getApi() {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_GOOGLE_API,
      headers: {
        "Content-Type": "application/json",
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
