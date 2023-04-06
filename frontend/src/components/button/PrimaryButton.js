import { CustomButton } from "@/components/button/Button";
import { BG_PRESS_ME, DARK_PRIMARY } from "@/utils/colors";

export function PrimaryButton({ text, handle, icon }) {
  return (
    <CustomButton
      text={text}
      border={BG_PRESS_ME}
      foregroundColor={DARK_PRIMARY}
      backgroundColor={BG_PRESS_ME}
      icon={icon}
      handle={handle}
    />
  );
}
