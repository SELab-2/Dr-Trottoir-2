import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";
import buildingInTourService from "@/services/buildingInTour.service";

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
   * Add a new entry to the tour endpoint.
   *
   * The data dict can have the following keys.
   * - name (string)
   * - region (url of an entry)
   * - buildings (list with dict: building (url) and order_index (int))
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    const tourData = { name: data.name, region: data.region };
    const response = await ApiInstance.post("tour/", tourData);

    for (const building of data.buildings) {
      await buildingInTourService.post({
        tour: response.data.url,
        order_index: building.order_index,
        building: building.building,
      });
    }
    return response.data;
  }

  /**
   * Update a tour by id. This creates a new tour entry.
   *
   * The data dict can have the following keys.
   * - name (string)
   * - region (url of an entry)
   * - buildings (list with dict: building (url) and order_index (int))
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const old_data = await this.getById(id);
    if (!("name" in data)) {
      data.name = old_data.name;
    }
    if (!("region" in data)) {
      data.region = old_data.region;
    }

    return await this.post(data);
  }

  /**
   * Update a tour by url. This creates a new tour entry.
   *
   * The data dict can have the following keys.
   * - name (string)
   * - region (url of an entry)
   * - buildings (list with dict: building (url) and order_index (int))
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "tour")) {
      const old_data = await this.getEntryByUrl(url);
      if (!("name" in data)) {
        data.name = old_data.name;
      }
      if (!("region" in data)) {
        data.region = old_data.region;
      }
      return await this.post(data);
    }
  }

  /**
   * Delete a tour by id. Deleting a Tour is not possible.
   *
   * @param id ID of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteById(id) {
    const response = await ApiInstance.delete(`tour/${id}/`);
    return response.data;
  }

  /**
   * Delete a tour by url. Deleting a Tour is not possible.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "tour")) {
      const response = await ApiInstance.delete(url);
      return response.data;
    }
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
