
function Selection({list, Component, callback}){
	console.log(list)
	return (
			<>
				{list.map((entry) => <Component key={entry["url"]} callback={callback} data={entry}/>)}
			</>
		)
}

export default function SelectionList({title, Component, callback, elements}){
	console.log(elements)
	return (
		<div className={"h-full p-4 w-1/6 rounded-lg overflow-y-auto bg-gray-100"}>
			<h1 className={"font-semibold"}>{title}</h1>
			<Selection list={elements} Component={Component} callback={callback}/>
		</div>
	)
}
