import {
  COLOR_DONE_1,
  COLOR_BAD_1,
  COLOR_MEH_1,
  COLOR_GOOD_1,
} from "@/utils/colors";
import ProgressBar from "react-customizable-progressbar";
import { clamp } from "@/utils/helpers";

export default function CustomProgressBar({ fraction, is_wheel }) {
  let percentage = clamp(0, fraction * 100, 100);

  let color = COLOR_BAD_1;
  if (percentage === 100) {
    color = COLOR_DONE_1;
  } else if (percentage > 66) {
    color = COLOR_GOOD_1;
  } else if (percentage > 33) {
    color = COLOR_MEH_1;
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
