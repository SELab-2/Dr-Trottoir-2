import { COLOR_LIGHT_BG_2, COLOR_ACCENT_1 } from "@/utils/colors";
import { useState } from "react";

export default function Selection({ list, Component, callback }) {
  const defaultBG = COLOR_LIGHT_BG_2;
  const selectedBG = COLOR_ACCENT_1;
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
