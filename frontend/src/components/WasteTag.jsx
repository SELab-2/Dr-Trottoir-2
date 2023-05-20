import ColoredTag from "@/components/Tag";
import Image from "next/image";
import Cell from "@/components/table/Cell";
import Outside from "/public/images/outside_building.png";
import Inside from "/public/images/inside_building.png";

export default function WasteTag({ entry }) {
  let wasteState = 2;
  if (entry.action === "Binnen") {
    wasteState = 1;
  }
  let classname = "bg-waste-other text-light-bg-1";
  let cut = false;
  if (entry.waste_type.toUpperCase() === "PMD") {
    classname = "bg-waste-PMD text-light-text";
  } else if (entry.waste_type.toUpperCase() === "GLAS") {
    classname = "bg-waste-glass text-light-text";
  } else if (entry.waste_type.toUpperCase() === "PAPIER") {
    classname = "bg-waste-paper text-light-bg-1";
  } else if (entry.waste_type.toUpperCase() === "REST") {
    classname = "bg-waste-rest text-light-bg-1";
  } else if (entry.waste_type.toUpperCase() === "GFT") {
    classname = "bg-waste-GFT text-light-bg-1";
  } else {
    cut = true;
  }

  return (
    <ColoredTag
      className={`rounded-lg w-full text-center overflow-hidden ${classname}`}
    >
      <div className={"flex flex-row space-x-1"}>
        <div
          className={"bg-light-bg-1 rounded-lg p-1 justify-center items-center"}
        >
          {wasteState === 1 && (
            <Image src={Inside} width={20} height={20} alt="inside" />
          )}
          {wasteState === 2 && (
            <Image src={Outside} width={20} height={20} alt="outside" />
          )}
        </div>
        <Cell cut={cut} maxWidth={"max-w-[30px]"}>
          <p className={classname}>{entry.waste_type.toUpperCase()}</p>
        </Cell>
      </div>
    </ColoredTag>
  );
}
