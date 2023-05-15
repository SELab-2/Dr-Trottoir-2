import { useState } from "react";
import Outside from "/public/images/outside_building.png";
import Inside from "/public/images/inside_building.png";
import Image from "next/image";

export default function WasteState({ state = 0, onChange, editable }) {
  const [wasteState, setWasteState] = useState(state);
  const [timesChanged, setTimesChanged] = useState(0);

  const changeState = () => {
    if (editable) {
      const newState = (wasteState + 1) % 3;
      const times = (timesChanged + 1) % 3;
      onChange(newState, times);
      setTimesChanged(times);
      setWasteState(newState);
    }
  };

  return (
    <div
      className={`w-6 h-6 rounded-md bg-light-bg-1 border-2 border-light-h-2 flex justify-center items-center ${
        editable && "cursor-pointer"
      }`}
      onClick={() => changeState()}
      data-testid="waste-state-component"
    >
      {wasteState == 1 && <Image src={Inside} className="w-5" alt="inside" />}
      {wasteState == 2 && <Image src={Outside} className="w-5" alt="outside" />}
    </div>
  );
}
