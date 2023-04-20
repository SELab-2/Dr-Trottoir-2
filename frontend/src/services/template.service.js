import ApiInstance from "@/services/ApiInstance";
import HelperService from "@/services/helper.service";
import { baseUrl } from "@/utils/baseUrl";

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
    console.log(all);
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
  async putEntry(data) {
    return HelperService.putModelEntryByUrl("/api/template", "template", data);
  }

  async postEntryByUrl(url, data) {
    return HelperService.postModelEntryByUrl(url, "template", data);
  }
}

export default new TemplateService();
