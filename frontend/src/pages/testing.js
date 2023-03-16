import Head from "next/head";
import {signIn} from "next-auth/react";
import axios from "axios";
import {baseUrl} from "@/utils/baseUrl";
import jwtDecode from "jwt-decode";

const email = 'admin@admin.com'
const password = 'admin'

export default function Testing() {

	const login = async (event) => {
		event.preventDefault()


		console.log('waiting for response...')
		const response = await signIn("credentials", {email, password, redirect: false})

		console.log(response)

		if (response?.error) {
			console.log("something went wrong... failed to login :(")
			console.log("    : ", response.error)
		} else {
			console.log("Login success! Enjoy your stay :)")
		}

	}

	const authorization = async () => {
		try {
			console.log('sending request to ', baseUrl + 'user/auth/', ' with data: ', {email, password})
			console.log('waiting for answer...')

			let response = await axios.post(baseUrl + 'user/auth/', {email, password})
			console.log(response.status)

			if (response.status !== 200) {
				return
			}

			const {access, refresh} = response.data
			const {exp} = jwtDecode(access)

			console.log('retrieving user')

			const authHeader = {Authorization: 'Bearer ' + access}
			response = await axios.get(baseUrl + 'user/me/', {headers: authHeader})
			if (response.status !== 200) {
				return null
			}
			const user = response.data

			console.log({access: access, refresh: refresh, exp: exp, user: user})
		} catch (error) {
			console.log(error)
			return null
		}
	}

	const buttonStyle = "underline active:text-gray-300"

	return (
		<>
			<Head>
				<title>Testing</title>
			</Head>
			<main className={`h-screen p-12 text-sm`}>
				<div className={"mb-40"}>
					<p className={"font-bold"}>This page is for testing purposes.</p>
				</div>
				<div>
{/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
{/*///// NOTE(Elias): Write your test code here: 															   */}
					<button onClick={login} className={buttonStyle}>click me for login</button>
					<br/>
					<br/>
					<br/>
					<button onClick={authorization} className={buttonStyle}>click me for auth</button>

{/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
				</div>
			</main>
		</>
	)
}
