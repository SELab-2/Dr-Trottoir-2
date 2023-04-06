import { BG_LIGHT_SECONDARY, DARK_TEXT, LIGHT_PRIMARY } from "@/utils/colors";
import { CustomCard } from "@/components/custom-card/CustomCard";

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
