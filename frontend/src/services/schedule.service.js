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
