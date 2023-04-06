import { BG_LIGHT_PRIMARY, LIGHT_PRIMARY } from "@/utils/colors";
import CustomCard from "@/components/custom-card/CustomCard";

export default function PrimaryCard({ title, icon, text, children, className }) {
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