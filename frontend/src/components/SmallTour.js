import CustomProgressBar from "@/components/ProgressBar";

export default function SmallTour({data, callback}){

	let name = ""
	let amount = 0
	if ( data !== undefined && data.hasOwnProperty("name") && data.hasOwnProperty("amount")){
		name = data["name"]
		amount = data["amount"]
	}
	console.log("hello from the smallTour")
	console.log(data)

	return (
		<div className={"bg-yellow p-6 rounded-lg space-y-3"}>
			<h1 className={"font-semibold"}>{name}</h1>
			<CustomProgressBar finishedCount={1} amount={amount}/>
		</div>
	)
}
