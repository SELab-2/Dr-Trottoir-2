import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {primaryButton} from "@/utils/colors";

export function CustomButton({text, handle, icon, backgroundColor, foregroundColor, border}){

	return (
		<button
			className="ring-2 mt-5 mb-8 py-3 px-6 text-center rounded font-bold"
			style={{color: foregroundColor, background: backgroundColor, borderColor: border, boxShadow: `0 0 0 3px ${border} inset !important`}}
			onClick={handle}>
			<FontAwesomeIcon icon={icon} style={{"--fa-primary-color": {backgroundColor}, "--fa-secondary-color": {foregroundColor}, "--fa-secondary-opacity": "1",}} />
			<span class="flex-1 ml-3 whitespace-nowrap">{text}</span>
		</button>
	)
}

export function PrimaryButton({text, handle, icon}){

	return (
		<CustomButton text={text} border={primaryButton} foregroundColor={"#ffffff"} backgroundColor={primaryButton} icon={icon} handleclick={handle}/>
	)
}

export function SecundaryButton({text, handle, icon}){

	return (
		<CustomButton text={text} border={"#d1d5db"} foregroundColor={"#000000"} backgroundColor={"#ffffff"} icon={icon} handleclick={handle}/>
	)
}



