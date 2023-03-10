import Head from 'next/head'
import {UserService} from "../../services/user.service";

export default function Login() {

	const handleLogin = async (event) => {
		event.preventDefault()

		const email = event.target.email.value
		const password = event.target.password.value

		if (!email || !password) {
			console.log('Invalid input')
			return
		}

		UserService.login(email, password).then(
			() => {
				console.log('Login success! Enjoy your stay :)')
			}, (error) => {
				console.log('something went wrong... login failed!')
				if (error.response && error.response.data && error.response.detail) {
					console.log(error.response.data.detail)
				}
			})
	}

	return (
		<>
			<Head>
				<title>Inloggen</title>
			</Head>
			<main className="flex justify-center p-20">
				<div className={"px-20 py-5 border-2"}>
					<form onSubmit={handleLogin}>
						<p className={"font-bold"}>Inloggen</p>
						<div>
							<p>Email:</p>
							<input className="border-2" type="text" id="email" name="email"/>
							<p>Wachtwoord:</p>
							<input className="border-2" type="password" id="password" name="password"/>
						</div>
						<button className="underline" type="submit">Log in</button>
					</form>
				</div>
			</main>
		</>
	)
}
