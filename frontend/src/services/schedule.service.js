import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class ScheduleService {
  /**
   * Returns all schedules that match the filters (args). If args is empty, all schedules will be returned.
   *
   * FILTERS:
   * - startDate (date)
   * - endDate (date)
   * - students (List with student URL's)
   * - tours (List with tour URL's)
   *
   * @param args Dictionary with the filters. The allowed filters are given above.
   * @returns {Promise<*>} A list with schedule entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("schedule/");
    return this.#filterSchedule(all, args);
  }

  /**
   * Returns a schedule by id. When the schedule does not exist, an empty dictionary will be returned.
   * @param id The ID of the schedule.
   * @returns {Promise<*|*[]>} Dictionary with a schedule entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`schedule/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the schedule entry of the url. If the schedule does not exist, an empty dictionary will be returned.
   * @param url A valid schedule entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "schedule");
  }

  /**
   * Update a schedule by id.
   *
   * The data dict can have the following keys.
   * - date
   * - student
   * -tour
   *
   * @param id ID of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchById(id, data) {
    const response = await ApiInstance.patch(`schedule/${id}/`, data);
    return response.data;
  }

  /**
   * Update a schedule by url.
   *
   * The data dict can have the following keys.
   * - date
   * - student
   * - tour
   *
   * @param url url of the entry you want to update.
   * @param data Dict, data you want to chance.
   * @returns {Promise<*>}
   */
  async patchByUrl(url, data) {
    if (HelperService.isCorrectModelUrl(url, "schedule")) {
      const response = await ApiInstance.patch(url, data);
      return response.data;
    }
  }

  /**
   * Delete a schedule by id.
   *
   * @param id ID of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteById(id) {
    const response = await ApiInstance.delete(`schedule/${id}/`);
    return response.data;
  }

  /**
   * Delete a schedule by url.
   *
   * @param url url of the entry you want to delete.
   * @returns {Promise<*>}
   */
  async deleteByUrl(url) {
    if (HelperService.isCorrectModelUrl(url, "schedule")) {
      const response = await ApiInstance.delete(url);
      return response.data;
    }
  }

  /**
   * Add a new entry to the region endpoint.
   *
   * The data dict must have the following keys.
   * - date
   * - student
   * - tour
   *
   * @param data dict with the data.
   * @returns {Promise<*>}
   */
  async post(data) {
    const response = await ApiInstance.post("schedule/", data);
    return response.data;
  }

  /**
   * Returns all the visit for a specific schedule.
   * @param id The ID of the schedule you want the visits of.
   * @returns {Promise<*|*[]>}
   */
  async getVisitsFromSchedule(id) {
    let response = await HelperService.getResponseByUrl(
      `schedule/${id}/visits/`
    );
    return response.status === 200 ? response.data : [];
  }

  /**
   * Returns all the schedule comments for a specific schedule.
   * @param id The ID of the schedule you want the schedule comments of.
   * @returns {Promise<*|*[]>}
   */
  async getCommentsFromSchedule(id) {
    let response = await HelperService.getResponseByUrl(
      `schedule/${id}/comments/`
    );
    return response.status === 200 ? response.data : [];
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of schedule entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterSchedule(data, args) {
    if (args.startDate) {
      data = data.filter(
        (schedule) => new Date(schedule.date) >= args.startDate
      );
    }
    if (args.endDate) {
      data = data.filter((schedule) => new Date(schedule.date) <= args.endDate);
    }
    if (args.students) {
      data = data.filter((schedule) =>
        args.students.includes(schedule.student)
      );
    }
    if (args.tours) {
      data = data.filter((schedule) => args.tours.includes(schedule.tour));
    }
    return data;
  }
}

export default new ScheduleService();
