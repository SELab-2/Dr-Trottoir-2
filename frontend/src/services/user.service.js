import axios from "axios";
import '@/services/auth.services'
import {baseUrl} from "@/utils/baseUrl";

// TODO(Elias):
//  1. Possibly store tokens in a single object (Look at pros and cons.)

const baseUrlUser = baseUrl + 'user'

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

export const UserService = {
	login,
}

