/**
 * Return the data of a get request of a page.
 * When an error occurs, an alert will be showen and the error will be returned.
 * @param url The URL where you want to perform a get request on.
 * @returns {Promise<*>}
 */
import ApiInstance from "@/services/ApiInstance";

class HelperService {
  async getResponseByUrl(url) {
    if (process.env.NEXT_PUBLIC_API_URL.includes("https:")) {
      url = url.replace("http:", "https:");
    }

    return await ApiInstance.getApi().get(url);

    // Error will be catched in the component if needed
    /*
    let response = null;
    try {
      response = await ApiInstance.getApi().get(url);
    } catch (e) {
      response = e;
      alert(JSON.stringify(e.message, null, 2));
    }
    return response;*/
  }

  /**
   * Return all entries from a page with pagination.
   * If an error occurs, an empty list will be returned.
   * @param url The url of the page with pagination
   * @returns {Promise<*[]>}
   */
  async getAllPagination(url) {
    let all = [];
    let response = await this.getResponseByUrl(url);

    // page does not use pagination or error occured
    if (response.status !== 200 || !("next" in response.data)) {
      return [];
    }

    all = response.data.results;
    while (response.data.next !== null) {
      response = await this.getResponseByUrl(response.data.next);
      if (response.status === 200) {
        all.push(...response.data.results);
      }
    }
    return all;
  }

  isCorrectModelUrl(url, model) {
    const regex = new RegExp(`\/api\/${model.toLowerCase()}\/[0-9]+\/?$`);
    if (regex.test(url)) {
      return true;
    } else {
      throw new Error(`${url} is not an entry of ${model}.`);
    }
  }

  async getModelEntryByUrl(url, model) {
    if (this.isCorrectModelUrl(url, model)) {
      const response = await this.getResponseByUrl(url);
      return response.status === 200 ? response.data : {};
    }
  }

  createFormData(data) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    return formData;
  }
}

export default new HelperService();
