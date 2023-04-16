import ApiInstance from "@/services/ApiInstance";

class BuildingService {
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
    let response = await this.getPage(`building/`);
    return response.status === 200 ? response.data : [];
  }

  /**
   * Returns building by id.
   * @param id The ID of the building.
   * @returns {Promise<*|*[]>}
   */
  async getBuildingById(id) {
    let response = await this.getPage(`building/${id}/`);
    return response.status === 200 ? response.data : [];
  }
}

export default new BuildingService();