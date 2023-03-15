import {baseUrl} from "@/utils/baseUrl";

const baseUrlUser = baseUrl + 'user'

async function getUserByToken() {
	return {id: 0, name: 'bob', surname: 'bobbob', email: 'bob@bobbob.com'}
}


export const UserService = {
	getUserByToken,
}
