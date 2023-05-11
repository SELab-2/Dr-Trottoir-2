import ColoredTag from "@/components/Tag";
import WasteState from "./WasteState";

export default function TableWasteSchedule({
  label,
  id,
  className,
  buildings,
  wasteTypes,
}) {
  const wastes = [
    {
      char: "R",
      full: "Rest",
      background: "bg-waste-rest",
    },
    {
      char: "P",
      full: "PMD",
      background: "bg-waste-PMD",
    },
    {
      char: "G",
      full: "Glas",
      background: "bg-waste-glass",
    },
    {
      char: "P",
      full: "Papier",
      background: "bg-waste-paper",
    },
    {
      char: "G",
      full: "GFT",
      background: "bg-waste-GFT",
    },
  ];
  const days = ["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex sticky left-4 bg-light-bg-2 mb-4 ml-4">
        {wastes.map((waste, index) => (
          <ColoredTag
            key={index}
            className={`text-dark-h-1 ${waste.background}`}
          >
            {waste.full}
          </ColoredTag>
        ))}
      </div>

      <table className="border-separate border-spacing-x-0.5">
        <thead>
          <tr>
            <th className="sticky left-0 bg-light-bg-2">Gebouw</th>
            {days.map((day, index) => {
              return (
                <>
                  <th colSpan={wastes.length} key={index}>
                    {day}
                  </th>
                  <th key={`gap-${index}`}></th>
                </>
              );
            })}
          </tr>
          <tr>
            <th className="sticky left-0 bg-light-bg-2"></th>
            {days.map((day, dayIndex) => {
              return (
                <>
                  {wastes.map((waste, wasteIndex) => {
                    return (
                      <th
                        key={`${dayIndex}-${wasteIndex}`}
                        className={`h-1 column-space rounded-t-lg text-dark-h-1 ${waste.background}`}
                      >
                        {waste.char}
                      </th>
                    );
                  })}
                  <th key={`gap-${dayIndex}`}></th>
                </>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {buildings.map((building, buildingIndex) => {
            return (
              <tr key={buildingIndex}>
                <td className="sticky left-0 bg-light-bg-2 px-2">
                  {building.building.nickname}
                </td>
                {days.map((day, dayIndex) => {
                  return (
                    <>
                      {wastes.map((waste, wasteIndex) => {
                        const isLastRow =
                          buildingIndex === buildings.length - 1;
                        return (
                          <td
                            key={`${dayIndex}-${wasteIndex}`}
                            className={`column-space ${
                              isLastRow ? "rounded-b-lg" : ""
                            } 
                            ${waste.background}`}
                          >
                            <WasteState />
                          </td>
                        );
                      })}
                      <td key={`gap-${dayIndex}`}>
                        <div key={dayIndex} className="w-2"></div>
                      </td>
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
