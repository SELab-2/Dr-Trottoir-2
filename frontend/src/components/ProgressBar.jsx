import {
  COLOR_DONE_1,
  COLOR_BAD_1,
  COLOR_MEH_1,
  COLOR_GOOD_1,
} from "@/utils/colors";
import { clamp } from "@/utils/helpers";

export default function CustomProgressBar({
  fraction,
  is_wheel,
  circleWidth,
  radius,
}) {
  let percentage = clamp(0, fraction * 100, 100);
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

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
      <svg
        width={circleWidth}
        height={circleWidth}
        viewBox={`0 0 ${circleWidth} ${circleWidth}`}
        className={""}
      >
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={"15px"}
          r={radius}
          className={"stroke-light-h-2 bg-primary-1 fill-none"}
        />
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={"10px"}
          r={radius || 0}
          className={"stroke-linecap-round fill-none"}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
            stroke: color,
          }}
          transform={`rotate(-90 ${circleWidth / 2} ${circleWidth / 2})`}
        />
      </svg>
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
