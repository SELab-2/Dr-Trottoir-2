import HelperService from "@/services/helper.service";

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
