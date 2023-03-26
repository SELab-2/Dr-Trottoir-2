import CustomProgressBar from "@/components/ProgressBar";

export default function SmallTour({data, callback}){

	let name = ""
	let amount = 1
	let finished = 0
	if ( data !== undefined && data.hasOwnProperty("name") && data.hasOwnProperty("amount") && data.hasOwnProperty("finished")){
		console.log(data["name"])
		console.log(data)
		name = data["name"]
		if (data["amount"] > 0){
			amount = data["amount"]
		}
		finished = data["finished"]
	}

	return (
		<div className={"bg-yellow p-4 rounded-lg space-y-3 cursor-pointer"} onClick={callback}>
			<h1 className={"font-semibold"}>{name}</h1>
			<CustomProgressBar finishedCount={finished} amount={amount}/>
		</div>
	)
}
