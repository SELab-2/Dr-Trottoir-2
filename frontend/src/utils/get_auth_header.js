// Important(Elias):
//   1. This is an outline for a authentication header function, currently waiting on the backend

export default function authHeader() {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!user || !user.accessToken) {
		return {}
	}
	return {Authorization: 'Bearer: ' + user.accessToken}
}
