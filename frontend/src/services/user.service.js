import ApiInstance from "@/services/ApiInstance";

class UserService {
  async getAll() {
    const response = await ApiInstance.getApi().get("user/");
    return response.data;
  }

  async deleteUser(pk) {
    const response = await ApiInstance.getApi().delete("user/" + pk + "/");
    return response.data;
  }
}

export default new UserService();
