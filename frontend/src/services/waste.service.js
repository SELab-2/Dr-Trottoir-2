import HelperService from "@/services/helper.service";
import ApiInstance from "./ApiInstance";

class WasteService {
  /**
   * Returns all waste entry that match the filters (args). If args is empty, all waste entry will be returned.
   * FILTERS:
   * - startDate (date)
   * - endDate (date)
   * - building (URL of a building)
   * @param args Dictionary with the filters.
   * @returns {Promise<*>} A list with waste entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination(`waste/`);
    return this.#filterWaste(all, args);
  }

  /**
   * Returns a waste entry by id. When the waste entry does not exist, an empty dictionary will be returned.
   * @param id The ID of the waste entry.
   * @returns {Promise<*|*[]>} Dictionary with a waste entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`waste/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the waste entry of the url. If the waste ebtry does not exist, an empty dictionary will be returned.
   * @param url A valid waste entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "waste");
  }

  /**
   * Add a new entry to the waste endpoint.
   *
   * The data dict must have the following keys.
   * - date
   * - action
   * - building
   * - waste_type
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    const response = await ApiInstance.post("waste/", data);
    return response.data;
  }

  /**
   * Delete a waste by id.
   *
   * @param id ID of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteById(id) {
    const response = await ApiInstance.delete(`waste/${id}/`);
    return response.data;
  }

  /**
   * Delete a waste by url.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "waste")) {
      const response = await ApiInstance.delete(url);
      return response.data;
    }
  }

  /**
   * Update a waste by id.
   *
   * The data dict can have the following keys.
   * - date
   * - action
   * - building
   * - waste_type
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const response = await ApiInstance.patch(`waste/${id}/`, data);
    return response.data;
  }

  /**
   * Update a waste by url.
   *
   * The data dict can have the following keys.
   * - date
   * - action
   * - building
   * - waste_type
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "waste")) {
      const response = await ApiInstance.patch(url, data);
      return response.data;
    }
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of waste entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterWaste(data, args) {
    if (args.building) {
      data = data.filter((entry) => args.building === entry.building);
    }
    if (args.startDate) {
      data = data.filter((entry) => new Date(entry.date) >= args.startDate);
    }
    if (args.endDate) {
      data = data.filter((entry) => new Date(entry.date) <= args.endDate);
    }
    return data;
  }
}

export default new WasteService();
