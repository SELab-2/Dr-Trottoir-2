import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCirclePlus,
} from '@fortawesome/free-solid-svg-icons'

export function PrimaryButton({text, handle}){

	return (
		<button className="bg-[#0087FF] text-white mt-5 mb-8 py-3 px-6 text-center rounded font-bold"
				onClick={handle}>
			<FontAwesomeIcon icon={faCirclePlus} style={{"--fa-primary-color": "#0087ff", "--fa-secondary-color": "#ffffff", "--fa-secondary-opacity": "1",}} />
			<span class="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

export function SecundaryButton({text, handle}){

	return (
		<button className="ring-2 ring-[#4D4D4D] mt-5 mb-8 py-3 px-3 text-center rounded font-bold"
				onClick={handle}>
			<FontAwesomeIcon icon={faCirclePlus} style={{"--fa-primary-color": "#000000", "--fa-secondary-color": "#ffffff", "--fa-secondary-opacity": "1",}} />
			<span class="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

