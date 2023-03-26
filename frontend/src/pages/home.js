import Head from "next/head";
import {getSession, signOut} from "next-auth/react"
import {useEffect, useState} from "react";
import {BuildingService} from "@/services/building.service";
import {UserService} from "@/services/user.service";
import SelectionList from "@/components/SelectionList";
import SmallTour from "@/components/SmallTour";
import {TourService} from "@/services/tour.services";
import {BuildingInTourService} from "@/services/buildingInTour.service";
import {VisitService} from "@/services/visit.service";

export default function Home() {
	const [response, setResponse] = useState('{}');
	const [tours, setTours] = useState([]);

	useEffect(  () => {
		const allTours = async () => {
			const response = await TourService.getAll()
			//setTours(JSON.stringify(response, null, 2))
			const btResponse = await BuildingInTourService.getAll()
			const visitResponse = await VisitService.getAll()
			const tour = []

			if (response.hasOwnProperty("results") && btResponse.hasOwnProperty("results") && visitResponse.hasOwnProperty("results")){
				const list = response["results"]
				const visits = visitResponse["results"].map((entry) => entry["building_in_tour"])
				console.log(visits)

				for(let i in list){
					let finished = 0
					const entry = list[i]
					const url = entry["url"]
					const buildings = btResponse["results"].filter((entry) => entry["tour"] === url).map((entry) => entry["url"])
					for(let i = 0; i < buildings.length; i++){
						for (let j = 0; j < visits.length; j++) {
							if ( visits[j] === buildings[i]){
								finished++
							}
						}
					}
					tour.push({"url": url, "name": entry["name"], "amount": buildings.length, "finished": finished})
				}
			}
			setTours(tour)
		}
		allTours().catch()
	},[]);

	const allBuildings = async () => {
		const response = await BuildingService.getAll()
		setResponse(JSON.stringify(response, null, 2))
	}

	const allUsers = async () => {
		const response = await UserService.getAll()
		setResponse(JSON.stringify(response, null, 2))
	}

	const buttonStyle = "underline pr-5 py-2"

	return (
		<>
			<Head>
				<title>Testing</title>
			</Head>
			<main className={`h-screen p-12 flex flex-col justify-between`}>
				<div className={"mb-20"}>
					<p className={"text-xl font-bold"}>Home.</p>
				</div>
				<div className={"h-4/6 flex flex-row space-x-4"}>
					<div className={"w-4/6"}>
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
					<SelectionList
						Component={({url, background, setSelected, callback, data}) => (<SmallTour key={url} background={background} setSelected={setSelected} callback={callback} data={data}/>)}
						title={"Rondes"}
						callback={() => {console.log("callback is called!")}}
						elements={tours}
					/>
				</div>
				<div className={"py-12"}>
					<p>By team 2 </p>
				</div>
			</main>
		</>
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
