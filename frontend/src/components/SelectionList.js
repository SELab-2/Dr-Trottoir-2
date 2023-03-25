

export default function SelectionList({title, Component, callback,}){
	return (
		<div className={"h-full p-4 w-1/6 rounded-lg overflow-y-auto bg-gray-100"}>
			<h1 className={"font-semibold"}>{title}</h1>
			<Component/>
		</div>
	)
}
