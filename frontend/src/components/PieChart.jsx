import { COLOR_DONE_1, COLOR_BAD_1, COLOR_MEH_1 } from "@/utils/colors";
import { clamp } from "@/utils/helpers";

/**
 * Piechart element where you can make a wheel with multiple segments
 * @param fractions A list of (maximum) 3 floats between 0 and 1 that represent the fractions of the wheel
 * @param circleWidth Width of the wheel
 * @param radius The radius of the wheel
 * @returns {JSX.Element}
 * @constructor
 */
export default function PieChart({ fractions, circleWidth, radius }) {
  const percentages = fractions.map((fraction) =>
    clamp(0, fraction * 100, 100)
  );
  const dashArray = radius * Math.PI * 2;

  let colors = [COLOR_BAD_1, COLOR_MEH_1, COLOR_DONE_1];

  let cumulativeFractions = 0;
  const rotations = fractions.map((fraction) => {
    cumulativeFractions += fraction;
    return -90 + 360 * (cumulativeFractions - fraction);
  });

  return (
    <svg
      width={circleWidth}
      height={circleWidth}
      viewBox={`0 0 ${circleWidth} ${circleWidth}`}
      className={""}
    >
      {percentages.map((percentage, index) => (
        <circle
          cx={circleWidth / 2}
          cy={circleWidth / 2}
          strokeWidth={"15px"}
          r={radius || 0}
          className={"fill-none"}
          key={index}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashArray - (dashArray * percentage) / 100,
            stroke: colors[index],
          }}
          transform={`rotate(${rotations[index]} ${circleWidth / 2} ${
            circleWidth / 2
          })`}
        />
      ))}
    </svg>
  );
}
