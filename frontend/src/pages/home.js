import Head from "next/head";
import {getSession, signOut} from "next-auth/react"
import {useState, useEffect} from "react";
import {BuildingService} from "@/services/building.service";
import {UserService} from "@/services/user.service";
import Layout from '@/components/layout';

export default function Home() {
	const [response, setResponse] = useState('{}');

	const [currentUser, setCurrentUser] = useState(null)
	const [isLoading, setLoading] = useState(false)

	const allBuildings = async () => {
		const response = await BuildingService.getAll()
		setResponse(JSON.stringify(response, null, 2))
	}

	const allUsers = async () => {
		const response = await UserService.getAll()
		setResponse(JSON.stringify(response, null, 2))
	}

	// Fetch the data about the current logged in User
	useEffect(() => {
		setLoading(true)
		UserService.getLoggedInUser()
			.then((data) => {
				setCurrentUser(data)
				setLoading(false)
			})
	}, [])

	// TODO: change to something usefull
	if (isLoading) return <p>Loading...</p>
	if (!currentUser) return <p>No profile data</p>


	const buttonStyle = "underline pr-5 py-2"

	return (
		<Layout user={currentUser}>
			<Head>
				<title>Testing</title>
			</Head>
			<main className={`h-full p-12 flex flex-col justify-between`}>
				<div className={"mb-20"}>
					<p className={"text-xl font-bold"}>Home.</p>
				</div>
				<div>
					<div>
						<h2 className={"text-lg font-bold pb-3"}>Test authentication</h2>
						<p>
							If you are viewing this page, you are successfully logged in <span className={"emoji"}>🥳</span>
						</p>
						<button className={buttonStyle} onClick={() => signOut()}>log out</button>
					</div>
					<div className={"pt-10"}>
						<h2 className={"text-lg font-bold pb-3"}>Test models</h2>
						<button className={buttonStyle} onClick={allBuildings}> All buildings </button>
						<button className={buttonStyle} onClick={allUsers}> All users </button>
					</div>
					<h2 className={"text-lg font-bold mt-10"}>Response</h2>
					<div className={"mt-3 mb-10 text-gray-800 bg-gray-200 min-w-full w-fit rounded-lg p-5"}>
						<pre> {response} </pre>
					</div>
				</div>
				<div className={"py-12"}>
					<p>By team 2 </p>
				</div>
			</main>
		</Layout>
	)
}

export async function getServerSideProps(context) {
	const session = await getSession(context)

	if (!session) {
		return {

			redirect: {
				destination: '/',
				permanent: false,
			}
		}
	}
	return {
		props: {session}
	}
}
