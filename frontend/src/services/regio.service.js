import HelperService from "@/services/helper.service";

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
