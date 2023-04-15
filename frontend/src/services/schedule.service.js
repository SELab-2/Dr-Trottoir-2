import ApiInstance from "@/services/ApiInstance";

class ScheduleService {
  /**
   * Return the data of a get request of a page.
   * When an error occurs, an alert will be showen and the error will be returned.
   * @param url The URL where you want to perform a get request on.
   * @returns {Promise<*>}
   */
  async getPage(url) {
    let response = null;
    try {
      response = await ApiInstance.getApi().get(url);
    } catch (e) {
      response = e;
      alert(JSON.stringify(e.message, null, 2));
    }
    return response;
  }

  /**
   * Return the schedules that meet the filter restriction in args.
   * An empty dict as args returns all the schedules.
   * @param args Args contains the values that are used to filter the schedules.
   *             The possible keys are startDate (date), endDate (date), students (list) and tours (list).
   * @returns {Promise<*[]>}
   */
  async getSchedules(args = {}) {
    let all = [];
    let response = await ApiInstance.getApi().get("schedule/");

    if (response.status === 200) {
      all = response.data.results;
      while (response.data.next != null) {
        const response = await this.getPage(response.data.next);
        if (response.status === 200) {
          all.push(...response.data.results);
        }
      }
      all = this.#filterSchedule(all, args);
    }
    return all;
  }

  /**
   * Returns all the visit for a specific schedule.
   * @param id The ID of the schedule you want the visits of.
   * @returns {Promise<*|*[]>}
   */
  async getVisitsFromSchedule(id) {
    let response = await this.getPage(`schedule/${id}/visits/`);
    return response.status === 200 ? response.data : [];
  }

  /**
   * Private function to filter the data with the restrictions provided in args.
   * @param data List of schedule entries
   * @param args Dict with filter arguments. Possible keys are startDate (date), endDate (date), students (list) and tours (list).
   * @returns {Promise<*>}
   */
  async #filterSchedule(data, args) {
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
