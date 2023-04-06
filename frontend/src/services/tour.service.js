import ApiInstance from "@/services/ApiInstance";

class TourService {
  async getAll() {
    const response = await ApiInstance.getApi().get("tour/");
    return response.data;
  }
}

export default new TourService();
