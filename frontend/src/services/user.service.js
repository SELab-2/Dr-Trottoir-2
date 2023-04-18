import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class UserService {
  /**
   * Returns all users that match the filters (args). If args is empty, all users will be returned.
   * @param args Dictionary with the filters. No filters implemented for user.
   * @returns {Promise<*>} A list with user entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("user/");
    return this.#filterUser(all, args);
  }

  /**
   * Returns a user by id. When the user does not exist, an empty dictionary will be returned.
   * @param id The ID of the user.
   * @returns {Promise<*|*[]>} Dictionary with a user entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`user/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the user entry of the url. If the user does not exist, an empty dictionary will be returned.
   * @param url A valid user entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "user");
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of user entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterUser(data, args) {
    return data;
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
