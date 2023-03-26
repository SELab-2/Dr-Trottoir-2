
function Selection({list, Component, callback}){
	return (
			<>
				{list.map((entry) => <Component key={entry["url"]} callback={callback} data={entry}/>)}
			</>
		)
}

export default function SelectionList({title, Component, callback, elements}){
	return (
		<div className={"h-full p-5 w-1/6 flex flex-col rounded-lg bg-gray-100"}>
			<h1 className={"font-semibold py-2"}>{title}</h1>
			<div className="h-full overflow-auto space-y-2 rounded-lg">
				<Selection list={elements} Component={Component} callback={callback}/>
			</div>
		</div>
	)
}
