import PrimaryCard from "@/components/custom-card/PrimaryCard";
import Selection from "@/components/selection/Selection";

export default function SelectionList({
  className,
  title,
  Component,
  callback,
  elements,
}) {
  return (
    <PrimaryCard className={className} title={title} text={""}>
      <div className="h-full overflow-auto space-y-2 rounded-lg">
        <Selection list={elements} Component={Component} callback={callback} />
      </div>
    </PrimaryCard>
  );
}
