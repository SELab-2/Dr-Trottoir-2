import { useEffect, useState } from "react";
import TourService from "@/services/tour.service";
import BuildingService from "@/services/building.service";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function TourBuildingAdd({ tourId }) {
  const [allBuildings, setAllBuildings] = useState([]);

  // index of selected building in allBuildings
  const [addBuilding, setAddBuilding] = useState(undefined);

  // All selected building, one building is listed in following format:
  // {building: <info_building>, order_index: <index>}
  const [selectedBuildings, setSelectedBuildings] = useState([]);

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      let selectedBuildings = [];
      if (tourId) {
        // set selectedBuildings in Tour
        selectedBuildings = await TourService.getBuildingsFromTour(tourId);
        // Fix the format of the data, change it to [{building: <info building>, order_index: <order>}...]
        const fixed_format = await Promise.all(
          selectedBuildings.map(async (building_in_tour) => ({
            building: await BuildingService.getEntryByUrl(
              building_in_tour.building
            ),
            order_index: building_in_tour.order_index,
          }))
        );
        setSelectedBuildings(
          fixed_format.sort((a, b) => a.order_index - b.order_index)
        );
      }
      // get all Buildings that are not in the tour
      const allBuildings = await BuildingService.get();
      const filtered = allBuildings.filter(
        (building) =>
          !selectedBuildings.some((b) => b.building === building.url)
      );
      setAllBuildings(filtered);
    }

    fetchData().then().catch();
  }, [tourId]);

  // add building to the active building list
  const onAddBuilding = () => {
    if (addBuilding !== undefined) {
      // add building to the active selectedBuildings
      const newSelectedBuildings = [...selectedBuildings];
      newSelectedBuildings.push({
        building: allBuildings[addBuilding],
        order_index:
          newSelectedBuildings.length !== 0
            ? newSelectedBuildings[newSelectedBuildings.length - 1]
                .order_index + 1
            : 0, // calculate last used index
      });
      setSelectedBuildings(newSelectedBuildings);

      // remove from not active buildings
      const newAllBuildings = [...allBuildings];
      newAllBuildings.splice(addBuilding, 1);
      setAllBuildings(newAllBuildings);
      setAddBuilding(undefined);

      // set the selected element to none
      const $select = document.querySelector("#addGebouw");
      $select.value = undefined;
    }
  };

  // remove building from the active building list
  const onRemoveBuilding = (index) => {
    // Add element to not selected buildings
    const newAllBuildings = [...allBuildings];
    newAllBuildings.push(selectedBuildings[index].building);
    setAllBuildings(newAllBuildings);

    // remove the element from the not selected buildings
    const newSelectedBuildings = [...selectedBuildings];
    newSelectedBuildings.splice(index, 1);
    //update order index for elements after the removed element
    for (let i = index; i < newSelectedBuildings.length; i++) {
      newSelectedBuildings[i].order_index--;
    }
    setSelectedBuildings(newSelectedBuildings);
  };

  // function activates when someone tries to move a building up the list
  const onMoveUp = (index) => {
    const newBuildings = [...selectedBuildings];
    if (index !== 0) {
      newBuildings[index].order_index--;
      newBuildings[index - 1].order_index++;
    }
    setSelectedBuildings(
      newBuildings.sort((a, b) => a.order_index - b.order_index)
    );
  };

  // function activates when someone tries to move a building down the list
  const onMoveDown = (index) => {
    const newBuildings = [...selectedBuildings];
    if (index < selectedBuildings.length - 1) {
      newBuildings[index].order_index++;
      newBuildings[index + 1].order_index--;
    }
    setSelectedBuildings(
      newBuildings.sort((a, b) => a.order_index - b.order_index)
    );
  };

  return (
    <div className={"space-y-2"}>
      <p className={"font-bold"}>Gebouwen</p>
      <SecondaryCard className={"space-y-2"}>
        <div className={"flex flex-row justify-center items-center space-x-2"}>
          <SelectForm
            id={"addGebouw"}
            label={"Nieuw Gebouw"}
            onChange={(e) => setAddBuilding(e.target.value)}
            className={"flex-grow"}
          >
            <option value={undefined}>--Please pick a building--</option>
            {allBuildings.map((building, index) => {
              return (
                <option key={index} value={index}>
                  {building.nickname}
                </option>
              );
            })}
          </SelectForm>

          <FontAwesomeIcon
            icon={faPlus}
            className={"cursor-pointer"}
            onClick={onAddBuilding}
          />
        </div>

        <p className={"font-bold pt-4"}>Actieve gebouw(en)</p>
        {selectedBuildings.length > 0 ? (
          selectedBuildings.map((data, index) => {
            return (
              <div
                key={index}
                className={
                  "bg-light-bg-1 w-full rounded-lg p-2 flex justify-center items-center space-x-5"
                }
              >
                <p className={"flex-grow"}>
                  {data.order_index + 1 + ". " + data.building.nickname}
                </p>
                <div className={"flex flex-col"}>
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    onClick={() => onMoveUp(index)}
                    className={"cursor-pointer"}
                  />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    onClick={() => onMoveDown(index)}
                    className={"cursor-pointer"}
                  />
                </div>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={"h-full cursor-pointer"}
                  onClick={() => onRemoveBuilding(index)}
                />
              </div>
            );
          })
        ) : (
          <p>Geen actieve gebouwen</p>
        )}
      </SecondaryCard>
    </div>
  );
}
