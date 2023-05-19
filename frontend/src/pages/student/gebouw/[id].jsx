import MobileLayout from "@/components/MobileLayout";
import { useEffect, useState } from "react";
import {
  faBuilding,
  faLocationDot,
  faComment,
  faImage,
  faCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import Dropdown from "@/components/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import wasteService from "@/services/waste.service";
import { getMonday, getSunday } from "@/utils/helpers";
import scheduleService from "@/services/schedule.service";
import { urlToPK } from "@/utils/urlToPK";
import buildingInTourService from "@/services/buildingInTour.service";
import WasteCalendar from "@/components/Wastecalendar";
import moment from "moment";
import tourService from "@/services/tour.service";
import visitService from "@/services/visit.service";
import Cell from "@/components/table/Cell";
import { getSession } from "next-auth/react";
import userService from "@/services/user.service";
import buildingService from "@/services/building.service";
import { useRouter } from "next/router";
import CommentModal from "@/components/CommentModal";
import PhotoCreation from "@/components/PhotoCreate";
import PhotoPage from "@/components/PhotoPage";
import Link from "next/link";

export default function StudentBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  // list with as elements a list of the waste entries with the index as the day
  const [wasteSchedule, setWasteSchedule] = useState([]);
  const [dates, setDates] = useState([]);
  const [arrival, setArrival] = useState(false);
  const [inside, setInside] = useState(false);
  const [departure, setDeparture] = useState(false);
  const [visitComments, setVisitComments] = useState(false);
  const [visitPhotos, setVisitPhotos] = useState([]);
  const [buildingVisit, setBuildingVisit] = useState(null);
  const [userUrl, setUserUrl] = useState(null);
  const router = useRouter();

  const monday = getMonday(new Date());
  const sunday = getSunday(new Date());

  useEffect(() => {
    async function fetchData(id) {
      if (buildings.length === 0) {
        let { user } = await getSession();
        const userId = urlToPK(user.url);
        user = await userService.getById(userId);
        setUserUrl(user.url);
        const schedules = await scheduleService.get({
          startDate: moment().startOf("day").toDate(),
          endDate: moment().endOf("day").toDate(),
          students: [user.url],
        });

        let scheduledBuildings = [];
        for (let i in schedules) {
          let schedule = schedules[i];
          let buildingsInTour = await tourService.getBuildingsFromTour(
            urlToPK(schedule.tour)
          );
          scheduledBuildings = scheduledBuildings.concat(
            await Promise.all(
              buildingsInTour.map(async (buildingInTour) => {
                if (id == urlToPK(buildingInTour.building)) {
                  let building = await buildingService.getEntryByUrl(
                    buildingInTour.building
                  );
                  building.schedule = schedule.url;
                  setSelectedBuilding(building);
                  loadSchedule(building);
                }
                return {
                  url: buildingInTour.building,
                  nickname: buildingInTour.building_data.nickname,
                  schedule: schedule.url,
                };
              })
            )
          );
        }
        setBuildings(scheduledBuildings);
      } else {
        await Promise.all(
          buildings.map(async (building) => {
            if (id == urlToPK(building.url)) {
              let selBuilding = await buildingService.getEntryByUrl(
                building.url
              );
              selBuilding.schedule = building.schedule;
              setSelectedBuilding(selBuilding);
              loadSchedule(selBuilding);
            }
          })
        );
      }
    }

    if (router.query.id) {
      fetchData(router.query.id);
    }

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
  }, [router.query.id]);

  async function changeBuilding(selected) {
    if (selected.length !== 0) {
      if (selectedBuilding === null || selectedBuilding.nickname !== selected) {
        const nicknameSelected = selected[0];
        let building = buildings.find(
          (building) => building.nickname == nicknameSelected
        );
        setSelectedBuilding(building);
        router.push("/student/gebouw/" + urlToPK(building.url));
      }
    } else {
      setSelectedBuilding(null);
    }
  }

  async function loadSchedule(building) {
    setArrival(false);
    setInside(false);
    setDeparture(false);
    setBuildingVisit(null);
    setVisitPhotos([]);
    setWasteSchedule([]);
    setVisitComments([]);

    const wastePromise = wasteService.get({
      startDate: monday,
      endDate: sunday,
      building: building.url,
    });

    const visitsPromise = scheduleService.getVisitsFromSchedule(
      urlToPK(building.schedule)
    );

    const [wastes, visits] = await Promise.all([wastePromise, visitsPromise]);
    setWasteSchedule(wastes);

    for (const visit of visits) {
      const visited_building = await buildingInTourService.getEntryByUrl(
        visit.building_in_tour
      );
      if (visited_building.building === building.url) {
        // Call if the selected building already has a visit
        await Promise.all([checkVisitPhotos(visit), loadComments(visit)]);
      }
    }
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

  async function loadComments(visit) {
    const comments = await visitService.getCommentsByVisit(urlToPK(visit.url));
    setVisitComments(comments);
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
          icon={faX}
          className="bg-bad-2 border-2 border-bad-1 mr-1 py-0.5 px-1 text-sm text-bad-1 rounded-md"
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
            <PhotoPage photo={photo}></PhotoPage>
          </div>
        ))}
      </div>
    );
  }

  function renderComments() {
    if (visitComments.length > 0) {
      return (
        <div className="space-y-2">
          {visitComments.map((comment, index) => {
            const date = new Date(comment.created_at);
            return (
              <div key={index} className="rounded-lg bg-light-bg-1 p-2 w-full">
                <div className="text-xs font-bold text-light-h-2">
                  {`${date.getDate()}-${
                    date.getMonth() + 1
                  }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}
                </div>
                <Cell cut cutLen={"[300px]"}>
                  {comment.text}
                </Cell>
              </div>
            );
          })}
        </div>
      );
    }
  }

  function renderPhotoCreation(state) {
    return (
      <PhotoCreation
        className={"ml-auto pr-1 text-primary-1 text-lg cursor-pointer"}
        scheduleUrl={selectedBuilding.schedule}
        state={state}
        buildingUrl={selectedBuilding.url}
        callback={photoAdded}
      ></PhotoCreation>
    );
  }

  function photoAdded() {
    if (buildingVisit !== null) {
      checkVisitPhotos(buildingVisit);
    } else {
      router.reload();
    }
  }

  return (
    <>
      <div className="w-full p-2">
        {buildings.length !== 0 && (
          <Dropdown
            icon={faBuilding}
            options={buildings.map((building) => building.nickname)}
            value={
              selectedBuilding === null ? undefined : selectedBuilding.nickname
            }
            onClick={changeBuilding}
          >
            {selectedBuilding == null ? (
              <div>Selecteer een gebouw</div>
            ) : (
              <div>{selectedBuilding.nickname}</div>
            )}
          </Dropdown>
        )}

        {selectedBuilding !== null && (
          <div>
            <PrimaryCard>
              <div>
                <div className="flex items-center">
                  <div className="font-bold text-lg text-light-h-1 flex items-center gap-x-2">
                    {selectedBuilding.nickname}
                    {renderCompletedIcon(arrival && inside && departure)}
                  </div>
                  <div className="ml-auto my-2">
                    <Link
                      href={selectedBuilding.manual || ""}
                      target="_blank"
                      className={
                        "align-middle border-2 py-2 px-2 text-center rounded-lg font-bold"
                      }
                    >
                      Handleiding
                    </Link>
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
                  <CommentModal
                    className={
                      "ml-auto pr-1 text-primary-1 text-lg cursor-pointer"
                    }
                    visitUrl={
                      buildingVisit === null ? buildingVisit : buildingVisit.url
                    }
                    userUrl={userUrl}
                    callback={() => loadComments(buildingVisit)}
                  ></CommentModal>
                </div>
                {renderComments()}
              </SecondaryCard>
              <SecondaryCard title="Foto's" icon={faImage} className="my-2">
                <PrimaryCard className="my-2">
                  <div className="font-bold flex">
                    Aankomst
                    <div className="ml-auto flex items-center justify-center">
                      {renderCompletedIcon(arrival)}
                      {renderPhotoCreation(1)}
                    </div>
                  </div>
                  {renderPhotos(1)}
                </PrimaryCard>
                <PrimaryCard className="my-2">
                  <div className="font-bold flex">
                    Binnen
                    <div className="ml-auto flex items-center justify-center">
                      {renderCompletedIcon(inside)}
                      {renderPhotoCreation(3)}
                    </div>
                  </div>
                  {renderPhotos(3)}
                </PrimaryCard>
                <PrimaryCard className="my-2">
                  <div className="font-bold flex">
                    Vertrek
                    <div className="ml-auto flex items-center justify-center">
                      {renderCompletedIcon(departure)}
                      {renderPhotoCreation(2)}
                    </div>
                  </div>
                  {renderPhotos(2)}
                </PrimaryCard>
              </SecondaryCard>
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
