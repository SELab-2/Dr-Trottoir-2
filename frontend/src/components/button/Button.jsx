import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomButton({
  text,
  handle,
  icon,
  backgroundColor,
  foregroundColor,
  border,
}) {
  return (
    <button
      className="border-2 my-5 py-3 px-6 text-center rounded font-bold"
      style={{
        color: foregroundColor,
        background: backgroundColor,
        borderColor: border,
      }}
      onClick={handle}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={"mr-3"}
          style={{
            "--fa-primary-color": { backgroundColor },
            "--fa-secondary-color": { foregroundColor },
            "--fa-secondary-opacity": "1",
          }}
        />
      )}
      <span className="flex-1 whitespace-nowrap">{text}</span>
    </button>
  );
}
