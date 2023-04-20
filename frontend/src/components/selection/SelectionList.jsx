import PrimaryCard from "@/components/custom-card/PrimaryCard";
import Selection from "@/components/selection/Selection";

export default function SelectionList({
  className,
  title,
  Component,
  callback,
  selectedStart,
  elements,
}) {
  return (
    <PrimaryCard
      className={"flex flex-col " + className}
      title={title}
      text={""}
    >
      <div className="overflow-y-scroll space-y-2 rounded-lg h-40 grow">
        <Selection
          list={elements}
          Component={Component}
          callback={callback}
          selectedStart={selectedStart}
        />
      </div>
    </PrimaryCard>
  );
}
