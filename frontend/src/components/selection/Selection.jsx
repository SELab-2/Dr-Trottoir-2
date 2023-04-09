import { BG_LIGHT_SECONDARY, BG_ACCENT } from "@/utils/colors";
import { useState } from "react";

export default function Selection({ list, Component, callback }) {
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
