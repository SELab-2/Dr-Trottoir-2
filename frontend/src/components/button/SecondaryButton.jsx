import CustomButton from "@/components/button/Button";
import {
  BG_LIGHT_PRIMARY,
  LIGHT_PRIMARY,
  LIGHT_SECONDARY,
} from "@/utils/colors";

export default function SecondaryButton({ text, handle, icon }) {
  return (
    <CustomButton
      text={text}
      border={LIGHT_SECONDARY}
      foregroundColor={LIGHT_PRIMARY}
      backgroundColor={BG_LIGHT_PRIMARY}
      icon={icon}
      handle={handle}
    />
  );
}
