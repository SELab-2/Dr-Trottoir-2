import ApiInstance from "@/services/ApiInstance";

class UserService {
  async getAll() {
    const response = await ApiInstance.getApi().get("user/");
    return response.data;
  }

  async getUserById(id) {
    let response;
    try {
      response = await ApiInstance.getApi().get(`user/${id}/`);
    } catch (e) {
      alert(JSON.stringify(e, null, 2));
      return []; // TODO: what to do when no data can be fetched.
    }

    if (response.status === 200) {
      return response.data;
    }
    return [];
  }
}

export default new UserService();
