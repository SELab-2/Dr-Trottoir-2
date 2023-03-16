import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {baseUrl} from "@/utils/baseUrl";
import jwtDecode from "jwt-decode";

async function refreshAccessToken(token) {
	const new_token = await axios.post(baseUrl + 'user/auth/refresh/', {refresh: token.refresh}).then(
		(response) => {
			if (response.status !== 200) {
				return null
			}
			return response.data
		})

	if (!new_token) {
		return null
	}

	const { exp } = jwtDecode(new_token.data.access)
	return { ...token, ...new_token, exp: Date.now() + exp*1000}
}

async function signInCallback(user, account, profile) {
	return true
}

async function jwtCallback({token, user, account, profile, isNewUser}) {
	console.log('jwt')
	if (account && user) {
		return user
	}
	if (Date.now() > token.exp) {
		token = refreshAccessToken(token)
	}
	return token
}

async function sessionCallback({session, token}) {
	console.log('session')
	session.user = token.user
	session.access = token.access
	session.refresh = token.refresh
	session.exp = token.exp
	return session
}

const credentialsProvider = CredentialsProvider({
	name: 'credentials',
	id: 'credentials',
	credentials: {
		email: { label: "Email", type: "text", placeholder: "bob@bobmail.bob"},
		password: { label: "Password", type: "password"},
	},
	async authorize(credentials) {

		console.log('authorize')

		// NOTE(Elias): Request access and refresh token
		const data = {email: credentials?.email, password: credentials?.password}
		const token = await axios.post( baseUrl + 'user/auth/', data).then(
			(response) => {
				if  (response.status !== 200) {
					return null
				}
				const { exp } = jwtDecode(response.data.access)
				return {
					access: response.data.access,
					exp: Date.now() + exp * 1000,
					refresh: response.data.refresh,
				}
			})

		if (!token) {
			return null
		}

		// NOTE(Elias): Request User
		const authHeader = {Authorization: 'Bearer ' + token.access}
		const user = await axios.get( baseUrl + 'user/me/', {headers: authHeader}).then(
			(response) => {
				if (response.status !== 200) {
					return null
				}
				return response.data;
			}
		)

		if (!user) {
			return null
		}

		// NOTE(Elias): Return user and tokens combined
		return { ...token, user}
	},
})

export default NextAuth({
	providers: [credentialsProvider],
	callbacks: {
		signIn: signInCallback,
		jwt: jwtCallback,
		session: sessionCallback,
	},
	session: {
		strategy: "jwt",
	},
})
