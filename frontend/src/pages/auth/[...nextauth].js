import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwtDecode from "jwt-decode";


// TODO(Elias): add secret (https://next-auth.js.org/v3/configuration/options#secret)

export default async function auth(req, res) {
	const baseServerUrl = 'http://django:8000/api/'

	const refreshAccessToken = async (token) => {
		try {
			const response = await axios.post(baseServerUrl + 'user/auth/refresh/', {refresh: token.refresh})

			if (response.status !== 200) {
				return null
			}

			const { access, refresh } = response.data
			const { exp } = jwtDecode(access)

			return {access: access, refresh: refresh, exp: exp, user: token.user}
		} catch (error) {
			return null
		}
	}

	const jwt = async ({token, user, account, profile, isNewUser}) => {
		if (account && user) {
			return user
		}
		if (Date.now()/1000 >= token.exp) {
			token = await refreshAccessToken(token)
		}
		return token
	}

	const session = async ({session, token}) => {
		if (!token) {
			return session
		}
		session.user = token.user
		session.access = token.access
		session.refresh = token.refresh
		session.exp = token.exp
		return session
	}

	const providers = [
		CredentialsProvider({
			name: 'credentials',
			id: 'credentials',
			type: 'credentials',
			credentials: {
				email: {label: "email", type: "text"},
				password: {label: "password", type: "password"},
			},
			async authorize({email, password}, req) {

				let response = await axios.post(  baseServerUrl + 'user/auth/', {email, password})

				if (response.status !== 200) {
					return null
				}

				const { access, refresh } = response.data
				const { exp } = jwtDecode(access)

				const authHeader = {Authorization: 'Bearer ' + access}
				response = await axios.get( baseServerUrl + 'user/me/', {headers: authHeader})
				if (response.status !== 200) {
					return null
				}
				const user = response.data

				return {access: access, refresh: refresh, exp: exp, user: user}
			},
		})
	]

	const options = {
		providers: providers,
		session: { strategy: "jwt", },
		callbacks: { jwt, session },
		secret: process.env.NEXTAUTH_SECRET,
		pages: {
			singIn: '/',
			singOut: '/',
			error: '/',
		},
	}

	return await NextAuth(req, res, options)
}

