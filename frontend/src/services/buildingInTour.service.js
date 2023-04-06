import ApiInstance from "@/services/ApiInstance";

class BuildingInTourService {
  async getAll() {
    const response = await ApiInstance.getApi().get("building_in_tour/");
    return response.data;
  }
}

export default new BuildingInTourService();
