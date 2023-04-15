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
   * Returns all the schedules.
   * @returns {Promise<*[]>}
   */
  async getAll() {
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
   * Returns all the schedules that meet the filters.
   * @param startDate The schedule needs to be scheduled on this date or onwards. We expect a date object.
   * @param endDate The schedule needs to be scheduled on this date or before it. We expect a date object.
   * @param students A list of allowed students. We expect the API URL of the student.
   * @param tours A list of allowed tours. We expect the API URL of the tour.
   * @returns {Promise<*[]>}
   */
  async filterSchedule(
    startDate = null,
    endDate = null,
    students = null,
    tours = null
  ) {
    let all = await this.getAll();
    if (startDate) {
      all = all.filter((schedule) => new Date(schedule.date) >= startDate);
    }
    if (endDate) {
      all = all.filter((schedule) => new Date(schedule.date) <= startDate);
    }
    if (students) {
      all = all.filter((schedule) => schedule.student in students);
    }
    if (tours) {
      all = all.filter((schedule) => schedule.tour in tours);
    }
    return all;
  }
}

export default new ScheduleService();
