import axios from "axios";
import { baseUrl } from "@/utils/baseUrl";
import getAuthHeader from "@/utils/getAuthHeader";

class ApiInstance {
  getApi() {
    const instance = axios.create({
      baseURL: baseUrl,
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
