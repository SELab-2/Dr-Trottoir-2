import HelperService from "@/services/helper.service";

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