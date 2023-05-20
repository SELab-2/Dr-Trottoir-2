import ColoredTag from "@/components/Tag";
import Cell from "@/components/table/Cell";
import Outside from "/public/images/outside_building.png";
import Inside from "/public/images/inside_building.png";
import Image from "next/image";
import WasteTag from "@/components/WasteTag";

/**
 * A waste calander that will show a div for every day in "dates" that is filled
 * with waste entries for that day that were given in "waste"
 * @param waste A list of waste entries from a certain building.
 * @param dates A list of dates.
 * @returns {JSX.Element}
 * @constructor
 */
export default function WasteCalendar({ waste, dates }) {
  const days = ["Ma", "Di", "Woe", "Do", "Vr", "Za", "Zo"];
  return (
    <div className={"flex flex-row space-x-2 overflow-auto"}>
      {dates.map((date, i) => {
        const wasteRest = waste.filter((entry) => {
          const wasteDate = new Date(entry.date);
          const day = wasteDate.getDate();
          const month = wasteDate.getMonth();
          const year = wasteDate.getFullYear();
          return (
            day === date.getDate() &&
            month === date.getMonth() &&
            year === date.getFullYear()
          );
        });
        return (
          <div key={i} className={"text-center font-bold shrink-0"}>
            <h1 className={"w-full"}>
              {days[i]}: {date.getDate()}/{date.getMonth() + 1}
            </h1>
            <div
              className={
                "flex flex-col shrink-0 bg-light-bg-1 p-1 rounded-lg items-center min-h-[50px] min-w-[30px]"
              }
            >
              {wasteRest.map((entry, index) => (
                <WasteTag entry={entry} key={index} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
