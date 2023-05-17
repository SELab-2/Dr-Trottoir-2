import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class UserService {
  /**
   * Returns all users that match the filters (args). If args is empty, all users will be returned.
   *
   * FILTERS:
   * - roles (list of allowed roles of the users: DEVELOPER = 1, SUPERADMIN = 2, SUPERSTUDENT = 3, OWNER = 4, STUDENT = 5)
   *
   * @param args Dictionary with the filters.
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
    if (args.roles) {
      data = data.filter((user) => args.roles.includes(user.role));
    }

    return data;
  }

  /**
   * Deletes a user by id.
   * @param id The ID of the user.
   * @returns {*} Empty string if the user is deleted.
   */
  async deleteById(id) {
    const response = await ApiInstance.getApi().delete("user/" + id + "/");
    return response.data;
  }
}

export default new UserService();
