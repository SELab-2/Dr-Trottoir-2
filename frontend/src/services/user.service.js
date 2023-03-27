import getAuthHeader from "@/utils/getAuthHeader";
import axios from "axios";
import { baseUrl } from "@/utils/baseUrl";

async function getRequest(request) {
	const authHeader = await getAuthHeader()
	if (!authHeader) {
		return {error: "failed to construct authorization header"}
	}
	const response = await axios.get(request, {headers: authHeader})
	if (response.status !== 200) {
		return {error: "failed to fetch users"}
	}
	return response.data
}

async function getAll() {
	return await getRequest(baseUrl + 'user/')
}

async function getLoggedInUser() {
	return await getRequest(baseUrl + 'user/me')
}


export const UserService = {
	getAll, getLoggedInUser
}
