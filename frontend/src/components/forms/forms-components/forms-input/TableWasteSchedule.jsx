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
  selectDayIndex,
  editable = true,
}) {
  const [changedWastes, setChangedWastes] = useState({});
  const [columnKey, setColumnKey] = useState(0);
  // Predefined waste types
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
  // Generate date strings for each day starting from the provided startDate
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

    const wasteFull = wasteType.full;
    const date = dateStrings[dayIndex];
    if (
      url in changedWastes &&
      date in changedWastes[url] &&
      wasteFull in changedWastes[url][date]
    ) {
      return changedWastes[url][date][wasteFull][0];
    }

    const buildingEntries = wasteSchedule[url];
    // If no entries exist for the building, return default state 0
    if (buildingEntries.length === 0) {
      return 0;
    }
    let state = 0;
    const dateString = dateStrings[dayIndex];
    // Find the corresponding waste entry for the given day and waste type
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

  const changeColumn = (dayIndex, waste) => {
    if (editable) {
      const wasteType = waste.full;
      const date = dateStrings[dayIndex];
      const tempWastes = { ...changedWastes };

      buildings.forEach((building) => {
        const url = building.building.url;
        tempWastes[url] = tempWastes[url] || {};
        tempWastes[url][date] = tempWastes[url][date] || {};
        if (wasteType in tempWastes[url][date]) {
          const [state, timesChanged] = tempWastes[url][date][wasteType];
          if (timesChanged === 2) {
            // 3 times changed == no change
            delete tempWastes[url][date][wasteType];
          } else {
            tempWastes[url][date][wasteType] = [
              (state + 1) % 3,
              timesChanged + 1,
            ];
          }
        } else {
          const state = getState(building, dayIndex, waste);
          tempWastes[url][date][wasteType] = [(state + 1) % 3, 1];
        }
      });
      setChangedWastes(tempWastes);
      setColumnKey((prevKey) => prevKey + 1);
      onChange(tempWastes);
    }
  };

  // Function to change the state of a waste entry
  const changeState = (building, dayIndex, waste, newState) => {
    // change the Wastes
    const url = building.building.url;
    const wasteType = waste.full;
    const date = dateStrings[dayIndex];

    // Update the changedWastes state with the modified waste entry
    const tempWastes = { ...changedWastes };
    tempWastes[url] = tempWastes[url] || {};
    tempWastes[url][date] = tempWastes[url][date] || {};
    if (wasteType in tempWastes[url][date]) {
      const timesChanged = tempWastes[url][date][wasteType][1];
      if (timesChanged === 2) {
        // 3 times changed == no change
        delete tempWastes[url][date][wasteType];
      } else {
        tempWastes[url][date][wasteType] = [newState, timesChanged + 1];
      }
    } else {
      tempWastes[url][date][wasteType] = [newState, 1];
    }
    setChangedWastes(tempWastes);
    onChange(tempWastes);
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
                {/* Table header cells for each day */}
                <th
                  colSpan={wastes.length}
                  key={index}
                  className={`${
                    selectDayIndex === index &&
                    "bg-primary-2 border-2 border-primary-1 rounded-md"
                  }`}
                >
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
                {/* Table header cells for each waste type */}
                {wastes.map((waste, wasteIndex) => (
                  <th
                    key={`${dayIndex}-${wasteIndex}`}
                    className={`h-1 column-space rounded-t-lg text-dark-h-1
                      ${waste.background}
                    ${editable && "cursor-pointer"}`}
                    onClick={() => changeColumn(dayIndex, waste)}
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
                          key={`${dayIndex}-${wasteIndex}-${columnKey}`}
                          className={`column-space ${
                            isLastRow ? "rounded-b-lg" : ""
                          }
                          ${waste.background}`}
                        >
                          <WasteState
                            key={`${dayIndex}-${wasteIndex}-${columnKey}`}
                            state={getState(building, dayIndex, waste)}
                            onChange={(newState) =>
                              changeState(building, dayIndex, waste, newState)
                            }
                            editable={editable}
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
