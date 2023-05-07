import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class TourService {
  /**
   * Returns all tours that match the filters (args). If args is empty, all tours will be returned.
   * @param args Dictionary with the filters. No filters implemented for tour.
   * @returns {Promise<*>} A list with tour entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("tour/");
    return this.#filterTour(all, args);
  }

  /**
   * Returns a tour by id. When the tour does not exist, an empty dictionary will be returned.
   * @param id The ID of the tour.
   * @returns {Promise<*|*[]>} Dictionary with a tour entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`tour/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the tour entry of the url. If the tour does not exist, an empty dictionary will be returned.
   * @param url A valid tour entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "tour");
  }

  /**
   * Returns all the building IDs for a specific tour.
   * @param id The ID of the tour you want the visits of.
   * @returns {Promise<*|*[]>}
   */
  async getBuildingsFromTour(id) {
    let response = await HelperService.getResponseByUrl(
      `tour/${id}/buildings/`
    );
    return response.status === 200 ? response.data : [];
  }

  /**
   * Update a tour by id. This creates a new tour entry.
   *
   * The data dict can have the following keys.
   * - TODO
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    //TODO
  }

  /**
   * Update a tour by url. This creates a new tour entry.
   *
   * The data dict can have the following keys.
   * - TODO
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "tour")) {
      //TODO
    }
  }

  /**
   * Delete a tour by id. Deleting a Tour is not possible.
   *
   * @param id ID of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteById(id) {
    throw new Error(`A tour can't be deleted`);
  }

  /**
   * Delete a tour by url. Deleting a Tour is not possible.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    throw new Error(`A tour can't be deleted`);
  }

  /**
   * Add a new entry to the tour endpoint.
   *
   * The data dict can have the following keys.
   * - TODO
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    //TODO
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of tour entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterTour(data, args) {
    return data;
  }
}

export default new TourService();
