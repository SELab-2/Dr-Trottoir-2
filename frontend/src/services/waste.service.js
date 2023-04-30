import HelperService from "@/services/helper.service";

class WasteService {
  /**
   * Returns all waste entry that match the filters (args). If args is empty, all waste entry will be returned.
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
    //TODO: add filters

    return data;
  }
}

export default new WasteService();
