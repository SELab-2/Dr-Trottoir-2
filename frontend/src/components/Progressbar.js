import {useEffect, useState} from "react";
import {low, average, high, done} from "@/utils/colors";

export default function Progressbar({finishedCount, amount}){
	const [percentage, setPercentage] = useState(0);
	const [color, setColor] = useState(low);


	useEffect(() => {
		let value = Math.floor((finishedCount/amount)*100)

		if (value <= 100){
			if ( value < 33) {
				setColor(low)
			}else if (value < 66){
				setColor(average)
			}else if (value < 99){
				setColor(high)
			}else {
				setColor(done)
			}
		}else {
			value = 0
			setColor(low)
		}
		setPercentage(value);

    },[]);

	return (
		<div className={"bg-gray-100 p-1 rounded"}>
			<div className={"py-1 px-1 rounded"} style={{width: `${percentage}%`, backgroundColor: color}}/>
		</div>
	)
}
