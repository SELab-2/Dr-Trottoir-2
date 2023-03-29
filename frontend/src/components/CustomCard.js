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
  class_style = "",
}) {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={"rounded-lg p-5 m-2" + class_style}
    >
      <div
        className="flex items-center"
        style={{ color: titleColor, fontSize: fontSize }}
      >
        {icon ? <FontAwesomeIcon className="mr-2" icon={icon} /> : <></>}
        <p className={"font-semibold"}>{title}</p>
      </div>
      <div className="max-w-sm" style={{ color: textColor }}>
        {text}
      </div>
      {children}
    </div>
  );
}

export function PrimaryCard({ title, icon, text, children, class_style }) {
  return (
    <CustomCard
      title={title}
      icon={icon}
      text={text}
      class_style={class_style}
      bgColor={BG_LIGHT_PRIMARY}
      titleColor={LIGHT_PRIMARY}
      textColor={LIGHT_PRIMARY}
      fontSize={"20px"}
    >
      {children}
    </CustomCard>
  );
}

export function SecondaryCard({ title, icon, text, children, class_style }) {
  return (
    <CustomCard
      title={title}
      icon={icon}
      text={text}
      class_style={class_style}
      bgColor={BG_LIGHT_SECONDARY}
      titleColor={DARK_TEXT}
      textColor={LIGHT_PRIMARY}
      fontSize={"16px"}
    >
      {children}
    </CustomCard>
  );
}
