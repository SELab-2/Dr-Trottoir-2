import Head from 'next/head'

export default function Login(){

	const handleLogin = async (event) => {
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
							<p>E-mailadres:</p>
							<input className="border-2 border-gray-200" type="text" id="email" name="email" required/>
							<p>Wachtwoord:</p>
							<input className="border-2 border-gray-200" type="password" id="password" name="password" required/>
						</div>
						<button className="underline" type="submit">Log in</button>
					</form>
				</div>
			</main>
		</>
	)

}
