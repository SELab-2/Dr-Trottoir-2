import HelperService from "@/services/helper.service";
import ApiInstance from "@/services/ApiInstance";

class RegionService {
  /**
   * Returns all regions that match the filters (args). If args is empty, all regions will be returned.
   * @param args Dictionary with the filters. No filters implemented for region.
   * @returns {Promise<*>} A list with region entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("region/");
    return this.#filterRegion(all, args);
  }

  /**
   * Returns a region by id. When the region does not exist, an empty dictionary will be returned.
   * @param id The ID of the region.
   * @returns {Promise<*|*[]>} Dictionary with a region entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`region/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the region entry of the url. If the region does not exist, an empty dictionary will be returned.
   * @param url A valid region entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "region");
  }

  /**
   * Update a region by id.
   *
   * The data dict can have the following keys.
   * - region_name
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const response = await ApiInstance.getApi().patch(`region/${id}/`, data);
    return response.data;
  }

  /**
   * Update a region by url.
   *
   * The data dict can have the following keys.
   * - region_name
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "region")) {
      const response = await ApiInstance.getApi().patch(url, data);
      return response.data;
    }
  }

  /**
   * Add a new entry to the region endpoint.
   *
   * The data dict can have the following keys.
   * - region_name
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    const response = await ApiInstance.getApi().post("region/", data);
    return response.data;
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of region entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterRegion(data, args) {
    //TODO: add filters

    return data;
  }
}

export default new RegionService();
