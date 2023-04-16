import ApiInstance from "@/services/ApiInstance";

class VisitService {
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
   * Returns photos of given visit.
   * @param id The ID of the visit you want photos of.
   * @returns {Promise<*|*[]>}
   */
  async getPhotosByVisit(id) {
    let response = await this.getPage(`visit/${id}/photos`);
    return response.status === 200 ? response.data : [];
  }

  async getAll() {
    let response = await this.getPage(`visit/`);
    return response.status === 200 ? response.data : [];
  }
}

export default new VisitService();
