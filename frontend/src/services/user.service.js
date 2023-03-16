import getAuthHeader from "@/utils/getAuthHeader";
import axios from "axios";
import {baseUrl} from "@/utils/baseUrl";

async function getAll() {
	const authHeader = await getAuthHeader()
	if (!authHeader) {
		return {error: "failed to construct authorization header"}
	}
	const response = await axios.get(baseUrl + 'user/', {headers: authHeader})
	if (response.status !== 200) {
		return {error: "failed to fetch users"}
	}
	return response.data
}


export const UserService = {
	getAll,
}
