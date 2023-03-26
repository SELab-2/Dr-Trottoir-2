import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {BG_PRESS_ME, BG_LIGHT_PRIMARY, LIGHT_PRIMARY, LIGHT_SECONDARY, DARK_PRIMARY} from "@/utils/colors";

export function CustomButton({text, handle, icon, backgroundColor, foregroundColor, border}){

	return (
		<button
			className="border-2 mt-5 mb-8 py-3 px-6 text-center rounded font-bold"
			style={{color: foregroundColor, background: backgroundColor, borderColor: border}}
			onClick={handle}>
			<FontAwesomeIcon icon={icon} style={{"--fa-primary-color": {backgroundColor}, "--fa-secondary-color": {foregroundColor}, "--fa-secondary-opacity": "1",}} />
			<span className="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

export function PrimaryButton({text, handle, icon}){

	return (
		<CustomButton text={text} border={BG_PRESS_ME} foregroundColor={DARK_PRIMARY} backgroundColor={BG_PRESS_ME} icon={icon} handle={handle}/>
	)
}

export function SecondaryButton({text, handle, icon}){

	return (
		<CustomButton text={text} border={LIGHT_SECONDARY} foregroundColor={LIGHT_PRIMARY} backgroundColor={BG_LIGHT_PRIMARY} icon={icon} handle={handle}/>
	)
}



