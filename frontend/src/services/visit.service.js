import HelperService from "@/services/helper.service";

class VisitService {
  /**
   * Returns all visits that match the filters (args). If args is empty, all visits will be returned.
   * @param args Dictionary with the filters. No filters implemented for visit.
   * @returns {Promise<*>} A list with visit entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("visit/");
    return this.#filterVisit(all, args);
  }

  /**
   * Returns a visit by id. When the visit does not exist, an empty dictionary will be returned.
   * @param id The ID of the visit.
   * @returns {Promise<*|*[]>} Dictionary with a visit entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`visit/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the visit entry of the url. If the visit does not exist, an empty dictionary will be returned.
   * @param url A valid visit entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "visit");
  }

  /**
   * Returns photos of given visit.
   * @param id The ID of the visit you want photos of.
   * @returns {Promise<*|*[]>}
   */
  async getPhotosByVisit(id) {
    let response = await HelperService.getResponseByUrl(`visit/${id}/photos`);
    return response.status === 200 ? response.data : [];
  }

  /**
   * Returns photos of given visit.
   * @param id The ID of the visit you want photos of.
   * @returns {Promise<*|*[]>}
   */
  async getCommentsByVisit(id) {
    let response = await HelperService.getResponseByUrl(
      `visit/${id}/comments/`
    );
    return response.status === 200 ? response.data : [];
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of visit entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterVisit(data, args) {
    return data;
  }
}

export default new VisitService();
