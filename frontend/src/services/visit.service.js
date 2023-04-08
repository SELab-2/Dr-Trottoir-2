import ApiInstance from "@/services/ApiInstance";

class VisitService {
  async getAll() {
    const response = await ApiInstance.getApi().get("visit/");
    return response.data;
  }
}

export default new VisitService();
