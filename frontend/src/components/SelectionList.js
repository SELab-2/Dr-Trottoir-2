import { BG_LIGHT_SECONDARY, BG_ACCENT } from "@/utils/colors";
import { useState } from "react";
import { PrimaryCard } from "@/components/CustomCard";

function Selection({ list, Component, callback }) {
  const defaultBG = BG_LIGHT_SECONDARY;
  const selectedBG = BG_ACCENT;
  const [selected, setSelected] = useState("");

  return (
    <>
      {list.map((entry) => {
        if (entry["url"] === selected) {
          return (
            <Component
              key={entry["url"]}
              background={selectedBG}
              setSelected={(string) => {
                setSelected(string);
              }}
              callback={callback}
              data={entry}
            />
          );
        } else {
          return (
            <Component
              key={entry["url"]}
              background={defaultBG}
              setSelected={(string) => {
                setSelected(string);
              }}
              callback={callback}
              data={entry}
            />
          );
        }
      })}
    </>
  );
}

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
      className={"h-full w-1/6 p-5 flex flex-col p-5"}
    >
      <div className="h-full overflow-auto space-y-2 rounded-lg">
        <Selection list={elements} Component={Component} callback={callback} />
      </div>
    </PrimaryCard>
  );
}
