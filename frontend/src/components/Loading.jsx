import { BG_PRESS_ME, BG_SELECTED } from "@/utils/colors";

export default function Loading({
  color = BG_PRESS_ME,
  backgroundColor = BG_SELECTED,
  className = "",
}) {
  return (
    <div className={className}>
      <div className={"p-1"}>
        <svg
          className="animate-spin -ml-1 mr-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke={backgroundColor}
            strokeWidth="4"
          ></circle>
          <path
            fill={color}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
