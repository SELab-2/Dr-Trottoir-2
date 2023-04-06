import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function CustomCard({
  title,
  icon,
  text,
  bgColor,
  titleColor,
  textColor,
  fontSize,
  children,
  className = "",
}) {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`rounded-lg p-5 m-2 ${className}`}
    >
      <div
        className="flex items-center"
        style={{ color: titleColor, fontSize: fontSize }}
      >
        {icon && <FontAwesomeIcon className="mr-2" icon={icon} />}
        <p className={"font-semibold"}>{title}</p>
      </div>
      <div className="max-w-sm" style={{ color: textColor }}>
        {text}
      </div>
      {children}
    </div>
  );
}

