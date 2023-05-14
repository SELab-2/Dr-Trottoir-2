import ColoredTag from "@/components/Tag";
import WasteState from "./WasteState";
import moment from "moment";
import React, { useState } from "react";

export default function TableWasteSchedule({
  className,
  buildings,
  wasteSchedule,
  startDate,
  onChange,
}) {
  const [changedWastes, setChangedWastes] = useState({});
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
  const dateStrings = days.map((day, dayIndex) =>
    moment(startDate)
      .add(dayIndex + 1, "days")
      .toDate()
      .toISOString()
      .substring(0, 10)
  );

  // Function to get the state for a specific building, day, and waste type
  const getState = (building, dayIndex, wasteType) => {
    const url = building.building.url;
    const buildingEntries = wasteSchedule[url];
    if (buildingEntries.length === 0) {
      return 0;
    }
    let state = 0;
    const dateString = dateStrings[dayIndex];
    buildingEntries.forEach((wasteEntry) => {
      if (
        wasteEntry.date === dateString &&
        wasteEntry.waste_type === wasteType.full
      ) {
        if (wasteEntry.action === "Binnen") {
          state = 1;
        } else {
          state = 2;
        }
      }
    });
    return state;
  };

  // Function to change the state of a waste entry
  const changeState = (building, dayIndex, waste, newState, timesChanged) => {
    // change the Wastes
    const url = building.building.url;
    const wasteType = waste.full;
    const date = dateStrings[dayIndex];

    const tempWastes = { ...changedWastes };
    tempWastes[url] = tempWastes[url] || {};
    tempWastes[url][date] = tempWastes[url][date] || {};
    if (timesChanged === 0) {
      tempWastes[url][date][wasteType] = null;
    } else {
      tempWastes[url][date][wasteType] = [newState, timesChanged];
    }
    setChangedWastes(tempWastes);
    onChange(tempWastes);
    console.log(tempWastes);
  };

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
            {days.map((day, index) => (
              <React.Fragment key={index}>
                <th colSpan={wastes.length} key={index}>
                  {day}
                </th>
                <th key={`gap-${index}`}></th>
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <th className="sticky left-0 bg-light-bg-2"></th>
            {days.map((day, dayIndex) => (
              <React.Fragment key={dayIndex}>
                {wastes.map((waste, wasteIndex) => (
                  <th
                    key={`${dayIndex}-${wasteIndex}`}
                    className={`h-1 column-space rounded-t-lg text-dark-h-1 ${waste.background}`}
                  >
                    {waste.char}
                  </th>
                ))}
                <th key={`gap-${dayIndex}`}></th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {buildings.map((building, buildingIndex) => {
            return (
              <tr key={buildingIndex}>
                <td className="sticky left-0 bg-light-bg-2 px-2">
                  {building.building.nickname}
                </td>
                {days.map((day, dayIndex) => (
                  <React.Fragment key={dayIndex}>
                    {wastes.map((waste, wasteIndex) => {
                      const isLastRow = buildingIndex === buildings.length - 1;
                      return (
                        <td
                          key={`${dayIndex}-${wasteIndex}`}
                          className={`column-space ${
                            isLastRow ? "rounded-b-lg" : ""
                          } 
                          ${waste.background}`}
                        >
                          <WasteState
                            state={getState(building, dayIndex, waste)}
                            onChange={(newState, timesChanged) =>
                              changeState(
                                building,
                                dayIndex,
                                waste,
                                newState,
                                timesChanged
                              )
                            }
                          />
                        </td>
                      );
                    })}
                    <td key={`gap-${dayIndex}`}>
                      <div key={dayIndex} className="w-2"></div>
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
