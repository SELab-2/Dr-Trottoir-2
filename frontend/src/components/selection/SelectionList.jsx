import PrimaryCard from "@/components/custom-card/PrimaryCard";
import Selection from "@/components/selection/Selection";

export default function SelectionList({
  title,
  Component,
  callback,
  elements,
}) {
  return (
    <PrimaryCard
      title={title}
      text={""}
      className={"h-full flex flex-col p-5"}
    >
      <div className="h-full overflow-auto space-y-2 rounded-lg">
        <Selection list={elements} Component={Component} callback={callback} />
      </div>
    </PrimaryCard>
  );
}
