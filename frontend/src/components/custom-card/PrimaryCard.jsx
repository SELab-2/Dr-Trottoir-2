import CustomCard from "@/components/custom-card/CustomCard";

export default function PrimaryCard({ title, icon, children, className }) {
  return (
    <CustomCard
      title={title}
      icon={icon}
      className={`bg-light-bg-1 text-light-text ${className}`}
    >
      {children}
    </CustomCard>
  );
}
