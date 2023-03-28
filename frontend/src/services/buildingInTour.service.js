import { baseUrl } from "@/utils/baseUrl";
import axios from "axios";
import getAuthHeader from "@/utils/getAuthHeader";

async function getAll() {
  const authHeader = await getAuthHeader();
  if (!authHeader) {
    return { error: "failed to construct authorization header" };
  }
  const response = await axios.get(baseUrl + "building_in_tour/", {
    headers: authHeader,
  });
  if (response.status !== 200) {
    return { error: "failed to fetch all buildings in a tour" };
  }
  return response.data;
}

export const BuildingInTourService = {
  getAll,
};
