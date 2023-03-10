import axios from "axios";
import authHeader from "@/utils/get_auth_header";
import {baseUrl} from "@/utils/baseUrl";


// Important(Elias):
//   1. This is an outline for the probable user service, currently waiting on the backend
// 	 2. Outdated tokens are not supported


const baseUrlUser = baseUrl + '/user/'


async function register(email, password, tel, role, buildings) {
	return await axios.post(`${baseUrlUser}`, {email, password, tel, buildings})
}

async function login(email, password) {
	return await axios.post(`${baseUrlUser}/login`, {email, password}).then((response) => {
		if (response.data.access) {
			response.data.user.accesToken = response.data.access;
			localStorage.setItem('user', JSON.stringify(response.data.user))
		}
		return response.data
	})
}

async function remove(userId) {
	return await axios.delete(`${baseUrlUser}/${userId}`, {headers: authHeader()})
}

async function logout() {
	localStorage.removeItem('user')
}

async function update(userId, data) {
	return await axios.patch(`${baseUrlUser}/${userId}`, data, {headers: authHeader()}).then(response => {
		local.setItem('user', JSON.stringify(JSON.stringify(response.data.user)))
	})
}

async function getById(userId) {
	return await axios.get(`${baseUrlUser}/${userId}`, {headers: authHeader()})
}

async function getAll() {
	return await axios.get(`${baseUrlUser}`, {headers: authHeader()})
}

export const UserService = {
	register,
	login,
	remove,
	logout,
	update,
	getById,
	getAll,
}

