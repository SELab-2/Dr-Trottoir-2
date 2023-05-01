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
import scheduleService from "@/services/schedule.service";
import { urlToPK } from "@/utils/urlToPK";
import buildingInTourService from "@/services/buildingInTour.service";
import WasteCalendar from "@/components/Wastecalendar";
import moment from "moment";
import tourService from "@/services/tour.service";
import visitService from "@/services/visit.service";

export default function StudentBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  // list with as elements a list of the waste entries with the index as the day
  const [wasteSchedule, setWasteSchedule] = useState([]);
  const [scheduleToday, setScheduleToday] = useState(false);
  const [dates, setDates] = useState([]);
  const [arrival, setArrival] = useState(false);
  const [inside, setInside] = useState(false);
  const [departure, setDeparture] = useState(false);

  const monday = getMonday(new Date());
  const sunday = getSunday(new Date());

  useEffect(() => {
    async function fetchData() {
      // Buildings
      const response = await BuildingService.get();
      setBuildings(response);
    }
    fetchData();

    const date = new Date();
    const dateFrom = moment(date).startOf("isoWeek").toDate();
    const dateTo = moment(date).endOf("isoWeek").toDate();
    const dates = [];
    let currentDate = new Date(dateFrom);
    while (currentDate <= dateTo) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDates(dates);
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
    setScheduleToday(false);
    setArrival(false);
    setInside(false);
    setDeparture(false);
    const wastes = await wasteService.get({
      startDate: monday,
      endDate: sunday,
      building: building.url,
    });
    setWasteSchedule(wastes);
    const schedules = await scheduleService.get({
      startDate: moment().startOf("day").toDate(),
      endDate: moment().endOf("day").toDate(),
    });

    let i = 0;
    let schedulePlanned = false;
    while (i < schedules.length && !schedulePlanned){
      let schedule = schedules[i];
      let buildingsInTour = await tourService.getBuildingsFromTour(urlToPK(schedule.tour));
      // Checks if building is in the scheduled tour
      schedulePlanned = buildingsInTour.some((buildingInTour) => buildingInTour.building == building.url);
      if (schedulePlanned){
        // Gets all visits from that specific schedule 
        const visits = await scheduleService.getVisitsFromSchedule(
          urlToPK(schedule.url)
        );
        console.log(visits);
        for (let j in visits) {
          let visit = visits[j];
          let visited_building = await buildingInTourService.getEntryByUrl(
            visit.building_in_tour
          );
          if (visited_building.building == building.url) {
            checkVisitPhotos(visit);
          }
        }
      }
      i++;
    }
    setScheduleToday(schedulePlanned);
  }

  async function checkVisitPhotos(visit){
    const photos = await visitService.getPhotosByVisit(urlToPK(visit.url));
    for (let i in photos){
      let photo = photos[i];
      let state = photo.state;
      if (state == "1"){
        setArrival(true);
      } else if (state == 2){
        setDeparture(true);
      } else if (state == 3){
        setInside(true);
      }
    }
  }

  function renderCompletedIcon(isCompleted) {
    if (isCompleted){
      return (
        <FontAwesomeIcon icon={faSquareCheck} className="pr-1 text-done-1 text-lg"/>
      )
    } else {
      return (
        <FontAwesomeIcon icon={faSquareXmark} className="pr-1 text-bad-1 text-lg"/>
      )
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
                  <div className="font-bold text-lg text-light-h-1 flex items-center gap-x-2">
                    {selectedBuilding.nickname}
                    {scheduleToday && renderCompletedIcon(arrival && inside && departure)}
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
              <SecondaryCard>
                <WasteCalendar waste={wasteSchedule} dates={dates}></WasteCalendar>
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
              {scheduleToday ? (
                <SecondaryCard title="Foto's" icon={faImage} className="my-2">
                  <PrimaryCard className="my-2 font-bold flex">
                    <div>Aankomst</div>
                    <div className="ml-auto">
                      {renderCompletedIcon(arrival)}
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        className="pr-1 text-primary-1 text-lg"
                      />
                    </div>
                  </PrimaryCard>
                  <PrimaryCard className="my-2 font-bold flex">
                    <div>Binnen</div>
                    <div className="ml-auto">
                      {renderCompletedIcon(inside)}
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        className="pr-1 text-primary-1 text-lg"
                      />
                    </div>
                  </PrimaryCard>
                  <PrimaryCard className="my-2 font-bold flex">
                    <div>Vertrek</div>
                    <div className="ml-auto">
                      {renderCompletedIcon(departure)}
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
