import Head from "next/head";

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
