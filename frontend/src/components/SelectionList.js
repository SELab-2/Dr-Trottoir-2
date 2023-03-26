import {BG_LIGHT_SECONDARY, BG_ACCENT} from "@/utils/colors";
import {useState} from "react";

function Selection({list, Component, callback}){
	const defaultBG = BG_LIGHT_SECONDARY
	const selectedBG = BG_ACCENT
	const [selected, setSelected] = useState("")

	return (
			<>
				{list.map((entry) => {
					if (entry["url"] === selected) {
						return (<Component key={entry["url"]} background={selectedBG} setSelected={(string) => {setSelected(string)}} callback={callback} data={entry}/>)
					}else {
						return (<Component key={entry["url"]} background={defaultBG} setSelected={(string) => {setSelected(string)}} callback={callback} data={entry}/>)
					}
				})}
			</>
		)
}

export default function SelectionList({title, Component, callback, elements}){
	return (
		<div className={"h-full p-5 w-1/6 flex flex-col rounded-lg bg-gray-400"}>
			<h1 className={"font-semibold py-2"}>{title}</h1>
			<div className="h-full overflow-auto space-y-2 rounded-lg">
				<Selection list={elements} Component={Component} callback={callback}/>
			</div>
		</div>
	)
}
