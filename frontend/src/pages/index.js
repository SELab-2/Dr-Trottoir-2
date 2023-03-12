import Head from 'next/head'
import {UserService} from "@/services/user.service";

import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png"
import Image from "next/image";
import {useRouter} from "next/router";

// TODO(Elias):
//   1. Add readable error messages such as 'incorrect password'
//   (Probably need a component to handle callouts in the website)
//   2. 'Wachtwoord vergeten' is not yet implemented
//   3. Figure out which email to put instead of placeholder 'help@drtrotoir.be'
//   4. Fix scaling issues

export default function Login() {
	const router = useRouter()

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
				router.push('/testing')
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
			<main className="h-screen flex flex-col justify-between p-12 text-sm">
				<div></div>
				<div className={"flex justify-center pb-40"}>
					<div className={"border-2 rounded-lg w-1/2"}>
						<div className={"flex justify-center p-8 bg-black rounded-t-lg"}>
							<Image src={Logo} alt={"logo"} width={128}></Image>
						</div>
						<form className={"py-12 p-40"} onSubmit={handleLogin}>
							<p className={"font-bold text-center mb-8 text-lg"}>Inloggen</p>
							<div>
								<div className={"pb-3"}>
									<p className={"text-gray-600"}>Email</p>
									<input className="w-full border-2 my-2 p-1 rounded" type="text" id="email"
										   name="email" autoComplete={"email"}/>
								</div>
								<div className={"pb-3"}>
									<p className={"text-gray-600"}>Wachtwoord</p>
									<input className="w-full border-2 my-2 p-1 rounded" type="password" id="password"
										   name="password" autoComplete={"current-password"}/>
								</div>
							</div>
							<button className="bg-yellow mt-5 mb-8 py-1 text-center w-full rounded font-bold"
									type="submit">Log in</button>
							<p className={"text-center"}>
								<a className={"text-blue-500"} href={"mail://asdf@dsfs.com"}>Wachtwoord Vergeten?</a>
							</p>
						</form>
					</div>
				</div>
				<div>
					<p className={"text-center"}>
						In geval van problemen, contacteer: <br/>
						<a className={"text-blue-500"} href={"mail://asdf@dsfs.com"}>help@drtrotoir.be</a>
					</p>
				</div>
			</main>
		</>
	)
}
