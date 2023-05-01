import MobileLayout from "@/components/MobileLayout";
import BuildingService from "@/services/building.service";
import { useEffect, useState } from "react";
import {
  faBuilding,
  faLocationDot,
  faComment,
  faImage,
  faSquarePlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import Dropdown from "@/components/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "@/components/button/Button";
import wasteService from "@/services/waste.service";
import { getMonday, getSunday } from "@/utils/helpers";
import scheduleService from "@/services/schedule.service";
import { urlToPK } from "@/utils/urlToPK";
import buildingInTourService from "@/services/buildingInTour.service";
import WasteCalendar from "@/components/Wastecalendar";
import moment from "moment";
import tourService from "@/services/tour.service";
import visitService from "@/services/visit.service";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import Cell from "@/components/table/Cell";

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
  const [visitPhotos, setVisitPhotos] = useState([]);
  const [buildingVisit, setBuildingVisit] = useState(null);

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
      loadSchedule(building);
    }
  };

  async function loadSchedule(building) {
    setScheduleToday(false);
    setArrival(false);
    setInside(false);
    setDeparture(false);
    setBuildingVisit(null);
    setVisitPhotos([]);
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
    while (i < schedules.length && !schedulePlanned) {
      let schedule = schedules[i];
      let buildingsInTour = await tourService.getBuildingsFromTour(
        urlToPK(schedule.tour)
      );
      // Checks if building is in the scheduled tour
      schedulePlanned = buildingsInTour.some(
        (buildingInTour) => buildingInTour.building == building.url
      );
      if (schedulePlanned) {
        // Gets all visits from that specific schedule
        const visits = await scheduleService.getVisitsFromSchedule(
          urlToPK(schedule.url)
        );
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

  async function checkVisitPhotos(visit) {
    const photos = await visitService.getPhotosByVisit(urlToPK(visit.url));
    setBuildingVisit(visit);
    setVisitPhotos(photos);
    for (let i in photos) {
      let photo = photos[i];
      let state = photo.state;
      if (state == 1) {
        setArrival(true);
      } else if (state == 2) {
        setDeparture(true);
      } else if (state == 3) {
        setInside(true);
      }
    }
  }

  function renderCompletedIcon(isCompleted) {
    if (isCompleted) {
      return (
        <FontAwesomeIcon
          icon={faCheck}
          className="bg-done-2 border-2 border-done-1 mr-1 p-0.5 text-md text-done-1 rounded-md"
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faSquare}
          className="bg-bad-2 border-2 border-bad-1 mr-1 p-0.5 text-sm text-bad-2 rounded-md"
        />
      );
    }
  }

  function renderPhotos(state) {
    let filtered = visitPhotos.filter((photo) => photo.state == state);
    return (
      <div className="flex flex-wrap">
        {filtered.map((photo, index) => (
          <div key={index} className="p-2">
            <Image
              src={photo.image}
              alt={index}
              width={75}
              height={75}
              unoptimized={true}
              className="rounded-md"
            />
          </div>
        ))}
      </div>
    );
  }

  function renderComments() {
    if (buildingVisit != null) {
      return (
        <div className={"rounded-lg bg-light-bg-1 p-2 w-full"}>
          <Cell cut cutLen={"[300px]"}>
            {buildingVisit.comment}
          </Cell>
        </div>
      );
    }
  }

  function addPhoto(state) {
    // Redirect to the photo taking page
    // If this is the first (arrival) photo, a visit object will have to be made with a POST-request
    console.log("Add photo");
  }

  function addComment() {
    // Redirect to the comment adding page
    console.log("Add comment");
  }

  function openManual() {
    if (selectedBuilding != null) {
      const manualUrl = selectedBuilding.manual;
      console.log("Open manual");
      // let the manual view on a page
    }
  }

  return (
    <>
      <div className="w-full p-2">
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
                    {scheduleToday &&
                      renderCompletedIcon(arrival && inside && departure)}
                  </div>
                  <div className="ml-auto">
                    <CustomButton className="-p-2" onClick={() => openManual()}>
                      Handleiding
                    </CustomButton>
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
                <WasteCalendar waste={wasteSchedule} dates={dates} />
              </SecondaryCard>
              <SecondaryCard className="my-3">
                <div className="flex">
                  <div className="font-bold text-light-h-2 mb-4 items-center">
                    <FontAwesomeIcon
                      icon={faComment}
                      className={"h-4 ml-1 mr-2"}
                    />
                    Opmerkingen
                  </div>
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    className="ml-auto pr-1 text-primary-1 text-lg cursor-pointer"
                    onClick={() => addComment()}
                  />
                </div>
                {renderComments()}
              </SecondaryCard>
              {scheduleToday ? (
                <SecondaryCard title="Foto's" icon={faImage} className="my-2">
                  <PrimaryCard className="my-2">
                    <div className="font-bold flex">
                      Aankomst
                      <div className="ml-auto" onClick={() => addPhoto(1)}>
                        {renderCompletedIcon(arrival)}
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          className="pr-1 text-primary-1 text-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    {renderPhotos(1)}
                  </PrimaryCard>
                  <PrimaryCard className="my-2">
                    <div className="font-bold flex">
                      Binnen
                      <div className="ml-auto" onClick={() => addPhoto(3)}>
                        {renderCompletedIcon(inside)}
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          className="pr-1 text-primary-1 text-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    {renderPhotos(3)}
                  </PrimaryCard>
                  <PrimaryCard className="my-2">
                    <div className="font-bold flex">
                      Vertrek
                      <div className="ml-auto" onClick={() => addPhoto(2)}>
                        {renderCompletedIcon(departure)}
                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          className="pr-1 text-primary-1 text-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    {renderPhotos(2)}
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
