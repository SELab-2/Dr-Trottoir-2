import CustomButton from "@/components/button/Button";

export default function SecondaryButton({
  children,
  onClick,
  className,
  icon,
}) {
  return (
    <CustomButton
      icon={icon}
      onClick={onClick}
      className={`bg-dark-bg-1 text-dark-h-1 hover:bg-dark-bg-2 active:bg-dark-bg-2 active:text-light-h-2 ${className}`}
    >
      {children}
    </CustomButton>
  );
}
