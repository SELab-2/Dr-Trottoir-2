import Head from "next/head";
import axios from "axios";
import {baseUrl} from "@/utils/baseUrl";
import jwtDecode from "jwt-decode";

const getUser = async () => {
}


export default function Testing() {
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

					<button className={"underline"} onClick={getUser}>click me!</button>

{/*////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
				</div>
			</main>
		</>
	)
}
