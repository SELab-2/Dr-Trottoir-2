import ApiInstance from "@/services/ApiInstance";

class UserService {
  async getAll() {
    const response = await ApiInstance.getApi().get("user/");
    return response.data;
  }

  async deleteUserById(id) {
    const response = await ApiInstance.getApi().delete("user/" + id + "/");
    return response.data;
  }
}

export default new UserService();
