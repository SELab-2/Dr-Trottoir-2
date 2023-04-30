import ColoredTag from "@/components/Tag";
import Cell from "@/components/table/Cell";

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
    <div className={"flex flex-row space-x-2 w-full h-auto"}>
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
              "flex flex-col flex-auto bg-light-bg-1 w-full p-1 rounded-lg items-center"
            }
          >
            {waste.map((entry, index) => {
              let classname = "bg-waste-other text-light-bg-1";
              let cut = true;
              if (entry.waste_type.toUpperCase() === "PMD") {
                classname = "bg-waste-PMD text-light-text";
                cut = false;
              } else if (entry.waste_type.toUpperCase() === "GLAS") {
                classname = "bg-waste-glass text-light-text";
                cut = false;
              } else if (entry.waste_type.toUpperCase() === "PAPIER") {
                classname = "bg-waste-paper text-light-bg-1";
              } else if (entry.waste_type.toUpperCase() === "REST") {
                classname = "bg-waste-rest text-light-bg-1";
                cut = false;
              }
              return (
                <ColoredTag
                  key={index}
                  className={`rounded-lg w-full text-center overflow-hidden ${classname}`}
                >
                  <Cell cut={cut} maxWidth={"30"}>
                    <p className={classname}>{entry.waste_type}</p>
                  </Cell>
                </ColoredTag>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
