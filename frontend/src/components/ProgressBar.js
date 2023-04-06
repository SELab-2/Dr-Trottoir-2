import { DONE, BAD, MEH, GOOD } from "@/utils/colors";
import ProgressBar from "react-customizable-progressbar";
import { clamp } from "@/utils/helpers";

export default function CustomProgressBar({ fraction, is_wheel }) {
  let percentage = clamp(0, fraction * 100, 100);

  let color = BAD;
  if (percentage === 100) {
    color = DONE;
  } else if (percentage > 66) {
    color = GOOD;
  } else if (percentage > 33) {
    color = MEH;
  }

  if (is_wheel) {
    return (
      <ProgressBar
        progress={percentage}
        radius={100}
        strokeColor={color}
        trackStrokeWidth={35}
        strokeWidth={20}
      />
    );
  }
  return (
    <div className={`bg-light-bg-2 p-1 rounded-lg`}>
      <div
        className={`py-1 px-1 rounded`}
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}
