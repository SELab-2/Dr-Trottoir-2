import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {baseUrl} from "@/utils/baseUrl";
import {UserService} from "@/services/user.service";

// TODO(Elias):
//  Document login system

// TODO(Elias):
//  Request and store the userid after successful authentication

// NOTE(Elias):
//	NextJS documentation suggested using next-auth (https://nextjs.org/docs/authentication)
//
//	Website this is based upon: 	https://remaster.com/blog/next-auth-jwt-session
//	NextAuth documentation:			https://next-auth.js.org/configuration/options



const credentialsProvider = CredentialsProvider({
	name: 'credentials',
	id:	'credentials',
	credentials: {
		email: { label: "Email", type: "text", placeholder: "bob@bobmail.bob"},
		password: { label: "Password", type: "password"},
	},
	async authorize(credentials, req) {
		const tokens = await axios.post(baseUrl + 'user/auth/', credentials).then(
			(response) => {
				if (!response || !response.data || !response.data.access || !response.data.refresh)	 {
					return null
				}
				return {  // Returns user object
					tokenAccess: response.data?.access,
					tokenRefresh: response.data?.refresh,
				}
			})

		const user = UserService.getUser()

	},
})

const jwtCallback = async ({token, user}) => {
	if (user) {
		token.accessToken = user.tokenAccess
		token.refresh_token= user.tokenRefresh
	}
  	return token
}

const sessionCallback = async ({session, token}) => {
	session.user = {

	}
	session.accessToken = token.accessToken
}

export default async function auth(req, res) {
    return await NextAuth(req, res, {
        session: {
            strategy: "jwt",
		},
		providers: [credentialsProvider],
		callbacks: {
			jwt_callback: jwtCallback,
			session_callback: sessionCallback,
		}
	});
}
