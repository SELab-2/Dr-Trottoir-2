import MobileLayout from "@/components/MobileLayout";
import BuildingService from "@/services/building.service";
import { useEffect, useState } from "react";
import {
  faBuilding,
  faLocationDot,
  faComment,
  faImage,
  faSquareCheck,
  faSquareXmark,
  faSquarePlus,
  faSquareRegular,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import Dropdown from "@/components/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "@/components/button/Button";
import BuildingImage from "/public/images/buildingimage.jpg";
import wasteService from "@/services/waste.service";
import { getMonday, getSunday } from "@/utils/helpers";
import ColoredTag from "@/components/Tag";
import scheduleService from "@/services/schedule.service";
import { urlToPK } from "@/utils/urlToPK";
import buildingInTourService from "@/services/buildingInTour.service";

export default function StudentBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  // list with as elements a list of the waste entries with the index as the day
  const [wasteSchedule, setWasteSchedule] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [wasteToday, setWasteToday] = useState(true);

  const monday = getMonday(new Date());
  const sunday = getSunday(new Date());

  useEffect(() => {
    async function fetchData() {
      // Buildings
      const response = await BuildingService.get();
      setBuildings(response);
    }
    fetchData();
  }, []);

  // Needs to change because nicknames aren't unique
  const changeBuilding = (selected) => {
    if (selected.length == 0) {
      setSelectedBuilding(null);
    } else {
      const nicknameSelected = selected[0];
      let building = buildings.find(
        (building) => building.nickname == nicknameSelected
      );
      setSelectedBuilding(building);
      loadWaste(building);
    }
  };

  async function loadWaste(building) {
    const wastes = await wasteService.get({
      startDate: monday,
      endDate: sunday,
      building: building.url,
    });
    let wasteDays = [];
    for (let i = 0; i < 5; i++) {
      wasteDays.push([]);
    }
    for (let i in wastes) {
      let wasteEntry = wastes[i];
      wasteDays[new Date(wasteEntry["date"]).getDay() - 1].push(wasteEntry); // -1 because sunday is defined as day 0
    }
    setWasteSchedule(wasteDays);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const schedules = await scheduleService.get({
      startDate: today,
      endDate: tomorrow,
    });

    if (schedules.length != 0) {
      let schedule = schedules[0];
      console.log(schedule);
      const visits = await scheduleService.getVisitsFromSchedule(
        urlToPK(schedule.url)
      );
      for (let i in visits) {
        let visit = visits[i];
        let visited_building = await buildingInTourService.getEntryByUrl(
          visit.building_in_tour
        );
        if (visited_building.building == building.url) {
          console.log("setcompleted wordt true");
          setCompleted(true);
        }
      }
    }
  }

  return (
    <>
      <div className="w-full p-2">
        <PrimaryCard className="mx-1 my-2 h-36 flex justify-center items-center">
          <Image src={BuildingImage} className="h-28 object-cover" alt="logo" />
        </PrimaryCard>
        <Dropdown
          icon={faBuilding}
          options={buildings.map((building) => building.nickname)}
          onClick={changeBuilding}
        >
          {selectedBuilding == null ? (
            <div>Selecteer een gebouw</div>
          ) : (
            <div>{selectedBuilding.nickname}</div>
          )}
        </Dropdown>

        {selectedBuilding !== null && (
          <div>
            <PrimaryCard>
              <div>
                <div className="flex items-center">
                  <div className="font-bold text-lg text-light-h-1">
                    {selectedBuilding.nickname}
                    {wasteToday &&
                      (completed ? (
                        <FontAwesomeIcon
                          icon={faSquareCheck}
                          className="mx-1 text-done-1"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSquareXmark}
                          className="mx-1 text-bad-1"
                        />
                      ))}
                  </div>
                  <div className="ml-auto">
                    <CustomButton className="-p-2">Handleiding</CustomButton>
                  </div>
                </div>
                <div className="flex text-light-h-1 items-center">
                  <FontAwesomeIcon icon={faLocationDot} className="pr-2" />
                  <div>{selectedBuilding.address_line_1}</div>
                  <div className="ml-auto">
                    {selectedBuilding.address_line_2}
                  </div>
                </div>
              </div>
              <SecondaryCard className="my-3 !p-2 flex space-x-1">
                {wasteSchedule.map((dayWaste, index) => (
                  <PrimaryCard key={index} className="w-full !p-1">
                    {dayWaste.map((waste, innerIndex) =>
                      waste["building"] == selectedBuilding.url ? (
                        <ColoredTag
                          key={innerIndex}
                          className="rounded-md overflow-clip w-full justify-center flex bg-dark-bg-2 text-dark-h-1 text-xs !mx-0 !my-1"
                        >
                          {waste["waste_type"].toUpperCase()}
                        </ColoredTag>
                      ) : null
                    )}
                  </PrimaryCard>
                ))}
              </SecondaryCard>
              <SecondaryCard
                title="Opmerkingen"
                icon={faComment}
                className="my-3 flex"
              >
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  className=" ml-auto pr-1 text-primary-1 text-lg"
                />
              </SecondaryCard>
              {wasteToday ? (
                <SecondaryCard title="Foto's" icon={faImage} className="my-2">
                  <PrimaryCard className="my-2 font-bold flex">
                    <div>Aankomst</div>
                    <div className="ml-auto">
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        className="pr-1 text-done-1 text-lg"
                      />
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        className="pr-1 text-primary-1 text-lg"
                      />
                    </div>
                  </PrimaryCard>
                  <PrimaryCard className="my-2 font-bold flex">
                    <div>Binnen</div>
                    <div className="ml-auto">
                      <FontAwesomeIcon
                        icon={faSquareXmark}
                        className="pr-1 text-bad-1 text-lg"
                      />
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        className="pr-1 text-primary-1 text-lg"
                      />
                    </div>
                  </PrimaryCard>
                  <PrimaryCard className="my-2 font-bold flex">
                    <div>Vertrek</div>
                    <div className="ml-auto">
                      <FontAwesomeIcon
                        icon={faSquareXmark}
                        className="pr-1 text-bad-1 text-lg"
                      />
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        className="pr-1 text-primary-1 text-lg"
                      />
                    </div>
                  </PrimaryCard>
                </SecondaryCard>
              ) : (
                <></>
              )}
            </PrimaryCard>
          </div>
        )}
      </div>
    </>
  );
}

StudentBuilding.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
