import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function PrimaryButton({text, handle, icon}){

	return (
		<button className="bg-[#0087FF] text-white mt-5 mb-8 py-3 px-6 text-center rounded font-bold"
				onClick={handle}>
			<FontAwesomeIcon icon={icon} style={{"--fa-primary-color": "#0087ff", "--fa-secondary-color": "#ffffff", "--fa-secondary-opacity": "1",}} />
			<span class="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

export function SecundaryButton({text, handle, icon}){

	return (
		<button className="ring-2 ring-gray-300 mt-5 mb-8 py-3 px-3 text-center rounded font-bold"
				onClick={handle}>
			<FontAwesomeIcon icon={icon} style={{"--fa-primary-color": "#000000", "--fa-secondary-color": "#ffffff", "--fa-secondary-opacity": "1",}} />
			<span class="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

export function CustomButton({text, handle, icon, backgroundColor, foregroundColor, border}){

	return (
		<button
			className="ring-2 mt-5 mb-8 py-3 px-3 text-center rounded font-bold"
			style={{color: foregroundColor, background: backgroundColor, borderColor: border, boxShadow: `0 0 0 3px ${border} inset !important`}}
			onClick={handle}>
			<FontAwesomeIcon icon={icon} style={{"--fa-primary-color": {backgroundColor}, "--fa-secondary-color": {foregroundColor}, "--fa-secondary-opacity": "1",}} />
			<span class="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

