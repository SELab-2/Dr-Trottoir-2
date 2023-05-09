import HelperService from "@/services/helper.service";
import ApiInstance from "@/services/ApiInstance";

class BuildingService {
  /**
   * Returns all buildings that match the filters (args). If args is empty, all buildings will be returned.
   * @param args Dictionary with the filters. No filters implemented for building.
   * @returns {Promise<*>} A list with building entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination(`building/`);
    return this.#filterBuilding(all, args);
  }

  /**
   * Returns a building by id. When the building does not exist, an empty dictionary will be returned.
   * @param id The ID of the building.
   * @returns {Promise<*|*[]>} Dictionary with a building entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`building/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the building entry of the url. If the building does not exist, an empty dictionary will be returned.
   * @param url A valid building entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "building");
  }

  /**
   * Add a new entry to the building endpoint.
   *
   * The data dict can have the following keys.
   * - nickname (string)
   * - description (string)
   * - country (string)
   * - address_line_1 (string)
   * - address_line_2 (string)
   * - region (url of region entry)
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    const response = await ApiInstance.getApi().post("building/", data);
    return response.data;
  }

  /**
   * Update a building by id.
   *
   * The data dict can have the following keys.
   * - nickname (string)
   * - description (string)
   * - country (string)
   * - address_line_1 (string)
   * - address_line_2 (string)
   * - region (url of region entry)
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const response = await ApiInstance.getApi().patch(`building/${id}/`, data);
    return response.data;
  }

  /**
   * Update a building by url.
   *
   * The data dict can have the following keys.
   * - nickname (string)
   * - description (string)
   * - country (string)
   * - address_line_1 (string)
   * - address_line_2 (string)
   * - region (url of region entry)
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "building")) {
      const response = await ApiInstance.getApi().patch(url, data);
      return response.data;
    }
  }

  /**
   * Delete a building by id.
   *
   * @param id ID of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteById(id) {
    const response = await ApiInstance.getApi().delete(`building/${id}/`);
    return response.data;
  }

  /**
   * Delete a building by url.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "building")) {
      const response = await ApiInstance.getApi().delete(url);
      return response.data;
    }
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of building entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterBuilding(data, args) {
    //TODO: add filters

    return data;
  }
}

export default new BuildingService();
