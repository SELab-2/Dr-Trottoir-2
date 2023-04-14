import CustomButton from "@/components/button/Button";

export default function PrimaryButton({ children, onClick, className, icon }) {
  return (
    <CustomButton
      onClick={onClick}
      icon={icon}
      className={`bg-primary-1 text-dark-h-1 hover:bg-primary-3 active:bg-primary-2 active:text-primary-1 ${className}`}
    >
      {children}
    </CustomButton>
  );
}
