import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class WasteService {
  /**
   * Returns all wastes that match the filters (args). If args is empty, all wastes will be returned.
   *
   * FILTERS:
   * - startDate (date)
   * - endDate (date)
   * - building (List id's of building)
   *
   * @param args Dictionary with the filters. The allowed filters are given above.
   * @returns {Promise<*>} A list with schedule entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("waste/");
    return this.#filterWaste(all, args);
  }

  /**
   * Returns a waste by id. When the waste does not exist, an empty dictionary will be returned.
   * @param id The ID of the schedule.
   * @returns {Promise<*|*[]>} Dictionary with a schedule entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`waste/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the waste entry of the url. If the waste does not exist, an empty dictionary will be returned.
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
    if (args.startDate) {
      data = data.filter(
        (schedule) => new Date(schedule.date) >= args.startDate
      );
    }
    if (args.endDate) {
      data = data.filter((schedule) => new Date(schedule.date) <= args.endDate);
    }
    if (args.buildings) {
      data = data.filter((waste) => args.buildings.includes(waste.building));
    }
    return data;
  }
}

export default new WasteService();
