import HelperService from "@/services/helper.service";

class PhotoService {
  /**
   * Returns all photos that match the filters (args). If args is empty, all photos will be returned.
   * @param args Dictionary with the filters. No filters implemented for photo.
   * @returns {Promise<*>} A list with photo entries.
   */
  async get(args = {}) {
    let all = await HelperService.getAllPagination("photo/");
    return this.#filterPhoto(all, args);
  }

  /**
   * Returns a photo by id. When the photo does not exist, an empty dictionary will be returned.
   * @param id The ID of the photo.
   * @returns {Promise<*|*[]>} Dictionary with a photo entry.
   */
  async getById(id) {
    const response = await HelperService.getResponseByUrl(`photo/${id}/`);
    return response.status === 200 ? response.data : {};
  }

  /**
   * Returns the photo entry of the url. If the photo does not exist, an empty dictionary will be returned.
   * @param url A valid photo entry URL.
   * @returns {Promise<*|{}>}
   */
  async getEntryByUrl(url) {
    return HelperService.getModelEntryByUrl(url, "photo");
  }

  async postPhoto(data) {
    const response = await HelperService.getPostResponse(`photo/`, data);
    return response.status === 201 ? response.data : {};
  }

  /**
   * Filter the data with the filters given in args.
   * @param data List of photo entries.
   * @param args Dictionary that contains filters.
   * @returns {*} The filtered data.
   */
  #filterPhoto(data, args) {
    //TODO: add filters

    return data;
  }
}

export default new PhotoService();
