import ApiInstance from "@/services/ApiInstance";

class BuildingService {
  async getAll() {
    const response = await ApiInstance.getApi().get("building/");
    return response.data;
  }

  async getOne(url) {
    const response = await ApiInstance.getApi().get(url);
    return response.data;
  }
}

export default new BuildingService();
