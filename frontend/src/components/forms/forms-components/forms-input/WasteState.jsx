import { useState } from "react";
import Outside from "/public/images/outside_building.png";
import Inside from "/public/images/inside_building.png";
import Image from "next/image";

export default function WasteState({ state = 0, onChange, editable }) {
  const [wasteState, setWasteState] = useState(state);

  const changeState = () => {
    if (editable) {
      const newState = (wasteState + 1) % 3;
      onChange(newState);
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
      {wasteState == 1 && (
        <Image src={Outside} width={20} height={20} alt="outside" />
      )}
      {wasteState == 2 && (
        <Image src={Inside} width={20} height={20} alt="inside" />
      )}
    </div>
  );
}
