import ColoredTag from "@/components/Tag";
import WasteState from "./WasteState";
import moment from "moment";
import React, { useState } from "react";
import PrimaryButton from "@/components/button/PrimaryButton";

/**
 * Table calendar which shows garbage collecting for one week and can be adjusted.
 * @param className Add extra classes to the table component.
 * @param building List of dictionaries which represent each building in a tour
 * @param wasteSchedule A dictionary which includes the waste for a specific week
 * @param startDate The start date of the week
 * @param onChange Function which will be called when a state is changed in the table
 * @param selectDayIndex The index of the day which has to be selected (optional)
 * @param editable Determines whether you can change the table
 * @returns {JSX.Element}
 * @constructor
 */
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
  const days = ["MA", "DI", "WO", "DO", "VR", "ZA", "ZO", "MA"];
  // Generate date strings for each day starting from the provided startDate
  const dateStrings = days.map((day, dayIndex) =>
    moment(startDate)
      .add(dayIndex + 1, "days")
      .toDate()
      .toISOString()
      .substring(0, 10)
  );
  const headerDates = days.map((day, dayIndex) => {
    const headerDate = moment(startDate).add(dayIndex, "days").toDate();
    return `${day} ${headerDate.getDate()}/${headerDate.getMonth() + 1}`;
  });

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
        if (wasteEntry.action === "Buiten") {
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

  const setInside = () => {
    let tempWastes = { ...changedWastes };
    // go through the already saved schedules
    Object.entries(wasteSchedule).forEach(([url, wastes]) => {
      wastes.forEach((waste) => {
        if (waste.action === "Buiten") {
          const wasteType = waste.waste_type;
          const dayAfter = moment(waste.date)
            .add(2, "days")
            .toDate()
            .toISOString()
            .substring(0, 10);
          tempWastes[url] = tempWastes[url] || {};
          tempWastes = updateInsideStates(
            tempWastes,
            url,
            dayAfter,
            wasteType,
            wastes
          );
        }
      });
    });
    // go through the changed entries
    for (const url in changedWastes) {
      for (const date in changedWastes[url]) {
        const dayAfter = moment(date)
          .add(2, "days")
          .toDate()
          .toISOString()
          .substring(0, 10);
        for (const wasteType in changedWastes[url][date]) {
          const state = changedWastes[url][date][wasteType][0];
          if (state === 1) {
            tempWastes = updateInsideStates(
              tempWastes,
              url,
              dayAfter,
              wasteType,
              wasteSchedule[url]
            );
          }
        }
      }
    }
    setColumnKey((prevKey) => prevKey + 1);
    setChangedWastes(tempWastes);
    onChange(tempWastes);
  };

  const updateInsideStates = (
    tempWastes,
    url,
    dayAfter,
    wasteType,
    buildingWastes
  ) => {
    tempWastes[url][dayAfter] = tempWastes[url][dayAfter] || {};
    if (wasteType in tempWastes[url][dayAfter]) {
      const [oldState, timesChanged] = tempWastes[url][dayAfter][wasteType];
      if (2 - oldState + timesChanged === 3) {
        // 3 times changed == no change
        delete tempWastes[url][dayAfter][wasteType];
      } else {
        tempWastes[url][dayAfter][wasteType] = [
          2,
          (2 - oldState + timesChanged) % 3,
        ];
      }
    } else {
      const match = buildingWastes.find(
        (entry) => entry.date === dayAfter && entry.waste_type === wasteType
      );
      if (!match) {
        tempWastes[url][dayAfter][wasteType] = [2, 2];
      } else if (match.action === "Binnen") {
        tempWastes[url][dayAfter][wasteType] = [2, 1];
      }
    }
    return tempWastes;
  };

  if (buildings.length === 0) {
    return <p className="ml-4">Deze ronde bevat geen gebouwen.</p>;
  }

  return (
    <div>
      <div className="inline-flex sticky left-4 bg-light-bg-2 mb-4 ml-4">
        {wastes.map((waste, index) => (
          <ColoredTag
            key={index}
            className={`text-dark-h-1 ${waste.background}`}
          >
            {waste.full}
          </ColoredTag>
        ))}
        {editable && (
          <PrimaryButton
            type="button"
            className="ml-4 font-normal"
            onClick={setInside}
          >
            Zet afval binnen na 1 dag
          </PrimaryButton>
        )}
      </div>

      <table className="border-separate border-spacing-x-0.5 mr-2 mb-2">
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
                  {headerDates[index]}
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
