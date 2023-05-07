import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class BuildingInTourService {
  /**
   * Returns all BuildingInTour that match the filters (args). If args is empty, all BuildingInTour will be returned.
   * @param args Dictionary with the filters. No filters implemented for BuildingInTour.
   * @returns {Promise<*>} A list with BuildingInTour entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("building_in_tour/");
    return this.#filterBuildingInTour(all, args);
  }

  /**
   * Returns a BuildingInTour by id. When the BuildingInTour does not exist, an empty dictionary will be returned.
   * @param id The ID of the BuildingInTour.
   * @returns {Promise<*|*[]>} Dictionary with a BuildingInTour entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(
      `building_in_tour/${id}/`
    );
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the BuildingInTour entry of the url. If the BuildingInTour does not exist, an empty dictionary will be returned.
   * @param url A valid BuildingInTour entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "building_in_tour");
  }

  /**
   * Add a new entry to the BuildingInTour endpoint.
   *
   * The data dict can have the following keys.
   * - tour (url)
   * - building (url)
   * - order_index (int)
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    const response = await ApiInstance.getApi().post("building_in_tour/", data);
    return response.data;
  }

  /**
   * Update a BuildingInTour by id.
   *
   * The data dict can have the following keys.
   * - tour (url)
   * - building (url)
   * - order_index (int)
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const response = await ApiInstance.getApi().patch(
      `building_in_tour/${id}/`,
      data
    );
    return response.data;
  }

  /**
   * Update a BuildingInTour by url.
   *
   * The data dict can have the following keys.
   * - tour (url)
   * - building (url)
   * - order_index (int)
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "building_in_tour")) {
      const response = await ApiInstance.getApi().patch(url, data);
      return response.data;
    }
  }

  /**
   * Delete a BuildingInTour by id.
   *
   * @param id ID of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteById(id) {
    const response = await ApiInstance.getApi().delete(
      `building_in_tour/${id}/`
    );
    return response.data;
  }

  /**
   * Delete a BuildingInTour by url.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "building_in_tour")) {
      const response = await ApiInstance.getApi().delete(url);
      return response.data;
    }
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of BuildingInTour entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterBuildingInTour(data, args) {
    return data;
  }
}

export default new BuildingInTourService();
