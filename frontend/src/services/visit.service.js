import {baseUrl} from "@/utils/baseUrl";
import axios from "axios";
import getAuthHeader from "@/utils/getAuthHeader";

async function getAll() {
	const authHeader = await getAuthHeader()
	if (!authHeader) {
		return {error: "failed to construct authorization header"}
	}
	const response = await axios.get(baseUrl + 'visit/', {headers: authHeader})
	if (response.status !== 200) {
		return {error: "failed to fetch all tours"}
	}
	return response.data
}


export const VisitService = {
	getAll,
}
