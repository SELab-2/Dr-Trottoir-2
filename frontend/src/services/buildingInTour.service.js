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
