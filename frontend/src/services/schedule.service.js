import ApiInstance from "@/services/ApiInstance";

class ScheduleService {
  async getAll() {
    let all = [];
    let response;
    try {
      response = await ApiInstance.getApi().get("schedule/");
    } catch (e) {
      alert(JSON.stringify(e, null, 2));
      return []; // TODO: what to do when no data can be fetched.
    }

    if (response.status === 200) {
      all = response.data.results;
      while (response.data.next != null) {
        const response = await ApiInstance.getApi().get(response.data.next);
        all.push(...response.data.results);
      }

      return all;
    }

    return [];
  }

  async getSchedule(id) {
    let response;
    try {
      response = await ApiInstance.getApi().get(`schedule/${id}/`);
    } catch (e) {
      alert(JSON.stringify(e, null, 2));
      return []; // TODO: what to do when no data can be fetched.
    }

    if (response.status === 200) {
      return response.data;
    }
    return [];
  }

  async getVisitsFromSchedule(id) {
    let response;
    try {
      response = await ApiInstance.getApi().get(`schedule/${id}/visits/`);
    } catch (e) {
      alert(JSON.stringify(e, null, 2));
      return []; // TODO: what to do when no data can be fetched.
    }

    if (response.status === 200) {
      return response.data;
    }
    return [];
  }
}

export default new ScheduleService();
