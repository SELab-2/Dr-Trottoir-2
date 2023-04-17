import ApiInstance from "@/services/ApiInstance";

class BuildingInTourService {
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

  async getAll() {
    let response = await this.getPage(`building_in_tour/`);
    return response.status === 200 ? response.data : [];
  }

  /**
   * Returns building_in_tour by id.
   * @param id The ID of the building_in_tour.
   * @returns {Promise<*|*[]>}
   */
  async getBuildingInTourById(id) {
    let response = await this.getPage(`building_in_tour/${id}/`);
    return response.status === 200 ? response.data : [];
  }
}

export default new BuildingInTourService();
