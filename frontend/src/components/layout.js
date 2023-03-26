import Head from 'next/head';
import Navbar from "@/components/Navbar";

export default function Layout({ children, user }) {

	return (
		<div className={"h-screen"}>
			<Head>
				<link rel="icon" href="/favicon_beer.ico" />
			</Head>

			<div><Navbar user={user}/></div>
			<div className={"border-4 border-green-700 p-4 sm:ml-64 h-full"}><main>{children}</main></div>
		</div>
	);
}
