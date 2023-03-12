import axios from "axios";
import {baseUrl} from "@/utils/baseUrl";

// TODO(Elias):
//  1. This code is not tested yet! Backend is not far along enough...
//  2. When do we call refreshAccessTokens()? Research/figure out a way to do this without doing too much requests.

const baseUrlAuth = `${baseUrl}/token/`

async function refreshAccessToken() {
	const refreshToken = JSON.parse(localStorage.getItem('token-refresh'))
	if (!refreshToken) {
		return null
	}
	return await axios.post(`${baseUrlAuth}/refresh/`, {refreshToken}).then(
		(response) => {
			if (response.data.access) {
				localStorage.setItem('token-access', JSON.stringify(response.data.access))
				return response.data.access
			}
			return null
		})
}

function getAuthHeader() {
	let token = JSON.parse(localStorage.getItem('token-access'))
	if (!token) {
		return {}
	}
	return {Authorization: 'Bearer: ' + token}
}

export const AuthService = {
	refreshAccessToken,
	getAuthHeader,
}
