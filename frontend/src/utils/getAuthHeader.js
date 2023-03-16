import {getSession} from "next-auth/react";

export default async function getAuthHeader() {
	const {access} = await getSession()
	return {Authorization: 'Bearer ' + access}
}
