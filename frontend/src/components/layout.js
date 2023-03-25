import Head from 'next/head';
import Navbar from "@/components/navbar";

export default function Layout({ children }) {

	const user = {
		first_name: "Michiel",
		last_name: "Lachaert"
	};

	return (
		<div className={"h-screen"}>
			<Head>
				<link rel="icon" href="/favicon_beer.ico" />
			</Head>

			<div><Navbar user={{first_name: "Michiel",last_name: "Lachaert"}}/></div>
			<div className={"border-4 border-green-700 p-4 sm:ml-64 h-full"}><main>{children}</main></div>
		</div>
	);
}
