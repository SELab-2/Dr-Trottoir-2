import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";
import axios from "axios";

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
   * Register a user.
   *
   * The data dict must have the following keys.
   * - firstname (string)
   * - lastname (string)
   * - email (string)
   * - password (string)
   * - passwordRepeat (string)
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async register(data) {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "user/auth/register/",
        data
      );
      return response.status === 201 ? {} : { error: response.data };
    } catch (error) {
      return error.response?.data
        ? { error: error.response.data }
        : { error: "Er trad een onbekende fout op." };
    }
  }

  /**
   * activate a user by id.
   *
   * @param id ID of the entry you want to activate.
   * @returns {Promise<any>}
   */
  async activateById(id) {
    const response = await ApiInstance.post(`user/${id}/activate/`);
    return response.data;
  }

  /**
   * activate a user by url.
   *
   * @param url url of the entry you want to activate.
   * @returns {Promise<any>}
   */
  async activateByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "user")) {
      const response = await ApiInstance.post(url);
      return response.data;
    }
  }

  /**
   * Update a user by id.
   *
   * The data dict can have the following keys.
   * - region (url)
   * - role (number between 1-5)
   * - active (bool)
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const response = await ApiInstance.patch(`user/${id}/`, data);
    return response.data;
  }

  /**
   * Update a user by url.
   *
   * The data dict can have the following keys.
   * - region (url)
   * - role (number between 1-5)
   * - active (bool)
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "user")) {
      const response = await ApiInstance.patch(url, data);
      return response.data;
    }
  }

  /**
   * Deletes a user by id.
   * @param id The ID of the user.
   * @returns {*} Empty string if the user is deleted.
   */
  async deleteById(id) {
    const response = await ApiInstance.delete("user/" + id + "/");
    return response.data;
  }

  /**
   * Delete a user by url.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "user")) {
      const response = await ApiInstance.delete(url);
      return response.data;
    }
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
}

export default new UserService();
