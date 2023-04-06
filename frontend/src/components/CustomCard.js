import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BG_LIGHT_PRIMARY,
  BG_LIGHT_SECONDARY,
  DARK_TEXT,
  LIGHT_PRIMARY,
} from "@/utils/colors";

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

export function PrimaryCard({ title, icon, text, children, className }) {
  return (
    <CustomCard
      title={title}
      icon={icon}
      text={text}
      className={className}
      bgColor={BG_LIGHT_PRIMARY}
      titleColor={LIGHT_PRIMARY}
      textColor={LIGHT_PRIMARY}
      fontSize={"20px"}
    >
      {children}
    </CustomCard>
  );
}

export function SecondaryCard({ title, icon, text, children, className }) {
  return (
    <CustomCard
      title={title}
      icon={icon}
      text={text}
      className={className}
      bgColor={BG_LIGHT_SECONDARY}
      titleColor={DARK_TEXT}
      textColor={LIGHT_PRIMARY}
      fontSize={"16px"}
    >
      {children}
    </CustomCard>
  );
}
