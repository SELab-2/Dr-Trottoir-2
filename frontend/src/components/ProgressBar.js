import {BG_BAD, BG_MEH, BG_GOOD, BG_DONE} from "@/utils/colors";
import ProgressBar from "react-customizable-progressbar";

export default function CustomProgressBar({finishedCount, amount, wheel}){
	let percentage = (finishedCount/amount)*100
	let color = BG_BAD

	if ( percentage >= 33 && percentage <= 100) {
		if (percentage < 66){
			color = BG_MEH
		}else if (percentage < 99){
			color = BG_GOOD
		}else {
			color = BG_DONE
		}
	}else if (percentage < 0 || percentage > 100){
		percentage = 0
	}

	if (wheel){
		return (
			<ProgressBar
				progress={percentage}
				radius={100}
				strokeColor={color}
				trackStrokeWidth={35}
				strokeWidth={20}
			/>
		)
	}else {
		return (
		<div className={"bg-gray-100 p-1 rounded"}>
			<div className={"py-1 px-1 rounded"} style={{width: `${percentage}%`, backgroundColor: color}}/>
		</div>
	)
	}

}
