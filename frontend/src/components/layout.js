import Head from 'next/head';
import Navbar from "@/components/Navbar";
import {useEffect, useState} from "react";
import {UserService} from "@/services/user.service";

export default function Layout({ children }) {

	const [currentUser, setCurrentUser] = useState(null)
	const [isLoading, setLoading] = useState(false)

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

	return (
		<div className={"h-screen"}>
			<Head>
				<link rel="icon" href="/favicon_beer.ico" />
			</Head>

			<div><Navbar user={currentUser}/></div>
			<div className={"p-4 sm:ml-64 h-full"}><main>{children}</main></div>
		</div>
	);
}
