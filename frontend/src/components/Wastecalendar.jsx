import ColoredTag from "@/components/Tag";
import Cell from "@/components/table/Cell";
import Outside from "/public/images/outside_building.png";
import Inside from "/public/images/inside_building.png";
import Image from "next/image";

/**
 * A waste calander that will show a div for every day in "dates" that is filled
 * with waste entries for that day that were given in "waste"
 * @param waste A list of waste entries from a certain building.
 * @param dates A list of dates.
 * @returns {JSX.Element}
 * @constructor
 */
export default function WasteCalendar({ waste, dates }) {
  return (
    <div className={"flex flex-row space-x-2 overflow-auto"}>
      {dates.map((date, i) => {
        const wasteRest = waste.filter((entry) => {
          const wasteDate = new Date(entry.date);
          const day = wasteDate.getDay();
          const month = wasteDate.getMonth();
          const year = wasteDate.getFullYear();
          return (
            day === date.getDay() &&
            month === date.getMonth() &&
            year === date.getFullYear()
          );
        });
        return (
          <div
            key={i}
            className={
              "flex flex-col grow shrink-0 bg-light-bg-1 p-1 rounded-lg items-center min-h-[50px] min-w-[30px]"
            }
          >
            {wasteRest.map((entry, index) => {
              console.log(entry);
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
                  key={index}
                  className={`rounded-lg w-full text-center overflow-hidden ${classname}`}
                >
                  <div className={"flex flex-row space-x-1"}>
                    <div
                      className={
                        "bg-light-bg-1 rounded-lg p-1 justify-center items-center"
                      }
                    >
                      {wasteState === 1 && (
                        <Image
                          src={Inside}
                          width={20}
                          height={20}
                          alt="inside"
                        />
                      )}
                      {wasteState === 2 && (
                        <Image
                          src={Outside}
                          width={20}
                          height={20}
                          alt="outside"
                        />
                      )}
                    </div>
                    <Cell cut={cut} maxWidth={"max-w-[30px]"}>
                      <p className={classname}>{entry.waste_type}</p>
                    </Cell>
                  </div>
                </ColoredTag>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
