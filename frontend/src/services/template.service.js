import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";

class TemplateService {
  /**
   * Returns all templates that match the filters (args). If args is empty, all templates will be returned.
   *
   * FILTERS:
   * - startDate (date)
   * - endDate (date)
   * - students (List with student URL's)
   * - tours (List with tour URL's)
   *
   * @param args Dictionary with the filters. The allowed filters are given above.
   * @returns {Promise<*>} A list with template entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("template/");
    return this.#filterTemplate(all, args);
  }

  /**
   * Returns a template by id. When the template does not exist, an empty dictionary will be returned.
   * @param id The ID of the template.
   * @returns {Promise<*|*[]>} Object with a template entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`template/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the template entry of the url. If the template does not exist, an empty object will be returned.
   * @param url A valid template entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "template");
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of template entries.
   * @param args Object that contains filters.
   * @returns {*} The filtered data.
   */
  #filterTemplate(data, args) {
    if (args.to) {
      data = data.filter((template) => template.to.contains(args.to));
    }
    if (args.cc) {
      data = data.filter((template) => template.cc.contains(args.to));
    }
    if (args.bcc) {
      data = data.filter((template) => template.bcc.contains(args.to));
    }
    if (args.subject) {
      data = data.filter((template) => template.subject.contains(args.to));
    }
    if (args.body) {
      data = data.filter((template) => template.body.contains(args.to));
    }
    return data;
  }

  async patchEntryByUrl(url, data) {
    const response = await ApiInstance.getApi().patch(url, data);
    return response.data;
  }

  async postEntry(data) {
    const response = await ApiInstance.getApi().post("template/", data);
    return response.data;
  }
}

export default new TemplateService();
