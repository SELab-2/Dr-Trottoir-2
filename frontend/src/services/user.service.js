import axios from "axios";
import '@/services/auth.services'
import {baseUrl} from "@/utils/baseUrl";
import {AuthService} from "@/services/auth.services";

// TODO(Elias):
//  1. This is code is not tested yet! Waiting on more progress in the backend before this is possible.
//  2. Possibly store tokens in a single object (Look at pros and cons.)

const baseUrlUser = baseUrl + 'user'


async function register(email, password, tel, role, buildings) {
	return await axios.post(`${baseUrlUser}`, {email, password, tel, buildings})
}

async function login(email, password) {
	return await axios.post(`${baseUrlUser}/auth/`, {email, password}).then(
		(response) => {
			if (response.data.access && response.data.refresh) {
				localStorage.setItem('token-access', JSON.stringify(response.data.access))
				localStorage.setItem('token-refresh', JSON.stringify(response.data.refresh))
			}
			return response.data
		})
}

async function remove(userId) {
	return await axios.delete(`${baseUrlUser}/${userId}`, {headers: AuthService.getAuthHeader()})
}

async function logout() {
	localStorage.removeItem('user')
}

async function update(userId, data) {
	return await axios.patch(`${baseUrlUser}/${userId}`, data, {headers: AuthService.getAuthHeader()}).then(response => {
		local.setItem('user', JSON.stringify(JSON.stringify(response.data.user)))
	})
}

async function getById(userId) {
	return await axios.get(`${baseUrlUser}/${userId}`, {headers: AuthService.getAuthHeader()})
}

async function getAll() {
	return await axios.get(`${baseUrlUser}`, {headers: AuthService.getAuthHeader()})
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

