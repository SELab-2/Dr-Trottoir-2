import Head from "next/head";
import { useSession } from "next-auth/react"

export default function Testing() {
	const { data: session } = useSession()

	if (!session) {
		return (
			<>
				<Head>
					<title>Testing</title>
				</Head>
				<main className={`h-screen flex flex-col justify-center p-12 text-sm`}>
					<p className={"mb-40 text-center font-bold text-red-500 text-lg"}>
						You are unauthorized! <span className={"emoji"}>🤬</span>
					</p>
				</main>
			</>
		)
	}


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

					<p>If you are viewing this page, you are successfully logged in <span className={"emoji"}>🥳</span></p>

{/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
				</div>
			</main>
		</>
	)
}
