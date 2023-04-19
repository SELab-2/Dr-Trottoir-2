import Head from "next/head";
import {
  faBriefcase,
  faCirclePlus,
  faEnvelope,
  faLocationDot,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SelectionList from "@/components/selection/SelectionList";
import { useEffect, useRef, useState } from "react";
import TourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import VisitService from "@/services/visit.service";
import CustomProgressBar from "@/components/ProgressBar";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import { useRouter } from "next/router";
import ScheduleService from "@/services/schedule.service";
import CustomTable from "@/components/table/Table";
import UserService from "@/services/user.service";
import ProfilePicture from "@/components/ProfilePicture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import BuildingService from "@/services/building.service";
import PhotoService from "@/services/photo.service";
import ColoredTag from "@/components/Tag";
import Cell from "@/components/table/Cell";
import scheduleService from "@/services/schedule.service";
import Link from "next/link";
import MapView from "@/components/MapView";

function SmallTour({ data, callback, setSelected, background }) {
  return (
    <div
      className={"rounded-lg space-y-3"}
      style={{ backgroundColor: background }}
    >
      <Link href={`/admin/rondes/${encodeURI(data["id"])}/`}>
        <div className={"p-4"}>
          <h1 className={"font-semibold"}>{data["name"]}</h1>
          <h2 className={"text-light-h-2"}> {data["date"]}</h2>
          <CustomProgressBar fraction={data["finished"] / data["amount"]} />
        </div>
      </Link>
    </div>
  );
}

export default function AdminTourPage() {
  const [url, setUrl] = useState("");
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [startDate, setStart] = useState(new Date());
  const [endDate, setEnd] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [finished, setFinished] = useState(0);
  const [buildings, setBuildings] = useState([]);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  async function setNewSchedules(dateFrom, dateTo) {
    const schedules = await scheduleService.get({
      startDate: dateFrom,
      endDate: dateTo,
    });
    const schedulesList = await Promise.all(
      schedules.map(async (entry) => await parseTour(entry))
    );
    setSchedules(schedulesList);
    setStart(dateFrom);
    setEnd(dateTo);
  }

  async function visit_finished(url) {
    const split = url.trim().split("/");
    const photoUrls = await VisitService.getPhotosByVisit(
      split[split.length - 2]
    );
    const photos = await Promise.all(
      photoUrls["photos"].map(async (entry) => {
        return await PhotoService.getEntryByUrl(entry);
      })
    );

    return photos.filter((entry) => entry["state"] === 2);
  }

  const parseTour = async (data) => {
    let split = data["url"].trim().split("/");
    const id = split[split.length - 2];
    const result = { url: data["url"], id: id, date: data["date"] };
    const tour = await TourService.getEntryByUrl(data["tour"]);
    console.log("ping");
    result["name"] = tour["name"];
    split = data["tour"].trim().split("/");
    const buildingIds = await TourService.getBuildingsFromTour(
      split[split.length - 2]
    );
    result["amount"] = 1;
    if (buildingIds["buildings"].length > 0)
      result["amount"] = buildingIds["buildings"].length;
    const scheduleVisits = await ScheduleService.getVisitsFromSchedule(id);
    let count = 0;
    for (const visit of scheduleVisits) {
      const response = await visit_finished(visit.url);
      if (response.length > 0) {
        count++;
      }
    }
    result["finished"] = count;
    return result;
  };

  useEffect(() => {
    const allTours = async () => {
      if (!router.isReady) return;
      const planning = router.query["pid"];
      const scheduleResponse = await ScheduleService.getById(planning);
      setUrl(scheduleResponse.url);
      // Set the week.
      const date = scheduleResponse.date;
      const dateFrom = moment(date).startOf("isoWeek").toDate();
      const dateTo = moment(date).endOf("isoWeek").toDate();
      // Looking for all the visits in this tour.
      const scheduleVisits = await ScheduleService.getVisitsFromSchedule(
        planning
      );
      setStart(dateFrom);
      setEnd(dateTo);
      const schedules = await scheduleService.get({
        startDate: dateFrom,
        endDate: dateTo,
      });
      const schedulesList = await Promise.all(
        schedules.map(async (entry) => await parseTour(entry))
      );
      const selectionObject = schedulesList.find(
        (obj) => obj.url === scheduleResponse.url
      );
      setName(selectionObject.name);
      setFinished(selectionObject["finished"]);
      setSchedules(schedulesList);

      // Get all the comments of a visit and calculating the time taken for a finished visit
      const comments = [];
      const time = {};
      for (const visit of scheduleVisits) {
        if (visit.comment !== "") {
          comments.push({
            comment: visit.comment,
            building: visit.building_in_tour_data.nickname,
          });
        }
        const buildInTour = await BuildingInTourService.getEntryByUrl(
          visit["building_in_tour"]
        );
        time[buildInTour["building"]] = "TBA";
        const photos = await visit_finished(visit.url);
        if (photos.length > 0) {
          const diff =
            new Date(photos[0]["created_at"]) - new Date(visit["arrival"]);
          let seconds = Math.round(diff / 1000);
          const minutes = Math.floor(seconds / 60);
          seconds -= minutes * 60;
          time[buildInTour["building"]] = `${minutes}m${seconds}s`;
        }
      }
      setComments(comments);

      // Searching the buildings of this tour
      let split = scheduleResponse["tour"].trim().split("/");
      const buildingIds = await TourService.getBuildingsFromTour(
        split[split.length - 2]
      );
      const buildings = await Promise.all(
        buildingIds["buildings"].map(async (buildingId) => {
          const building = await BuildingService.getById(buildingId);
          let computedTime = time[building["url"]];
          let status = "Onderweg";
          if (computedTime === undefined) {
            computedTime = "TBA";
          } else if (computedTime === "TBA") {
            status = "Bezig";
          } else {
            status = "Klaar";
          }
          const owners = building["owners"]
            .map(
              ({ first_name, last_name, email }) =>
                `${first_name} ${last_name} (${email})`
            )
            .join(", ");
          return [
            building.nickname,
            `${building.address_line_1} ${building.address_line_2}`,
            status,
            owners,
            computedTime,
          ];
        })
      );
      setBuildings(buildings);

      // We set the user for this specific tour.
      const userResponse = await UserService.getEntryByUrl(
        scheduleResponse["student"]
      );
      setUser(userResponse);
    };
    allTours().catch();
  }, [router.isReady, router]);

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"h-full bg-light-bg-2 flex flex-col py-6 px-3 space-y-4"}>
        <div className={"h-full bg-light-bg-2 flex flex-row space-x-2"}>
          <PrimaryCard
            className={
              "w-9/12 h-full lg:overflow-y-hidden max-h-max flex flex-col"
            }
            title={"Details"}
          >
            <div className={"space-y-4 h-full"}>
              <div className={"flex flex-row"}>
                <h1 className={"text-light-h-1 font-bold text-lg"}>{name}</h1>
                <div className={"w-full flex justify-end"}>
                  <Link href={"#"}>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size={"lg"}
                      className={"mt-1 mx-3"}
                    />
                  </Link>
                  <Link href={"#"}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size={"lg"}
                      className={"mt-1 "}
                    />
                  </Link>
                </div>
              </div>
              <div className={"flex flex-row space-x-2 h-3/6"}>
                <div
                  className={"w-fit flex flex-col space-y-2 h-full lg:h-max"}
                >
                  <Link href={"#"}>
                    <SecondaryCard
                      className={"h-2/6"}
                      icon={faBriefcase}
                      title={"Aangeduide student"}
                    >
                      <div className={"flex flex-row space-x-4"}>
                        <ProfilePicture />
                        <div>
                          <h1 className={"text-light-h-1 font-bold text-base"}>
                            {user.first_name} {user.last_name}
                          </h1>
                          <div className={"flex flex-row space-x-4"}>
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className={"h-4 mt-1 mx-2"}
                            />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </SecondaryCard>
                  </Link>
                  <SecondaryCard
                    className={"h-4/6"}
                    icon={faBriefcase}
                    title={"Progress"}
                  >
                    <div className={"h-4/5 flex justify-center items-center"}>
                      <div
                        className={
                          "flex flex-row content-center items-center justify-center space-x-2"
                        }
                      >
                        <CustomProgressBar
                          is_wheel
                          circleWidth={110}
                          radius={45}
                          className={"flex-shrink"}
                          fraction={
                            finished /
                            (buildings.length === 0 ? 1 : buildings.length)
                          }
                        />
                        <h1 className={"text-light-h-1 font-bold text-base"}>
                          {finished}/{buildings.length} Gebouwen klaar
                        </h1>
                      </div>
                    </div>
                  </SecondaryCard>
                </div>

                <SecondaryCard
                  icon={faLocationDot}
                  title={"Opmerkingen"}
                  className={"h-full w-1/2 sm:w-2/6 flex flex-col"}
                >
                  <div className={"space-y-2 h-full overflow-auto"}>
                    {comments.map((entry, index) => (
                      <div
                        key={index}
                        className={"rounded-lg bg-light-bg-1 p-2"}
                      >
                        <h1 className={"text-light-h-1 font-bold text-base"}>
                          {entry.building}
                        </h1>
                        <Cell cut cutLen={"[300px]"}>
                          {entry.comment}
                        </Cell>
                      </div>
                    ))}
                  </div>
                </SecondaryCard>

                <SecondaryCard
                  className={"h-full w-4/5 flex flex-col"}
                  icon={faLocationDot}
                  title={"Wegbeschrijving"}
                >
                  <div className={"flex justify-center items-center"}>
                    <MapView
                      route={buildings.map((building) => building[1])}
                      mapHeight={500}
                      mapWidth={800}
                    />
                  </div>
                </SecondaryCard>
              </div>
              <SecondaryCard
                className={"lg:h-2/6 h-3/6"}
                icon={faBriefcase}
                title={"Gebouwen"}
              >
                <CustomTable
                  className={"w-full"}
                  columns={[
                    {
                      name: "Naam",
                      createCell: (name) => <Link href={"#"}>{name}</Link>,
                    },
                    { name: "Adres", cut: true },
                    {
                      name: "Status",
                      createCell: (status) => {
                        let className = "font-bold text-good-1 bg-good-2";
                        if (status === "Onderweg") {
                          className = "font-bold text-bad-1 bg-bad-2";
                        } else if (status === "Bezig") {
                          className = "font-bold text-meh-1 bg-meh-2";
                        }
                        return (
                          <ColoredTag className={className}>
                            {status}
                          </ColoredTag>
                        );
                      },
                    },
                    { name: "Verantwoordelijke", cut: true },
                    { name: "Tijd" },
                  ]}
                  data={buildings}
                />
              </SecondaryCard>
            </div>
          </PrimaryCard>

          <div
            className={"bg-light-bg-2 flex w-3/12 flex-col space-y-2 h-full"}
          >
            <div className={"flex flex-row space-x-2 w-full"}>
              <CustomWeekPicker
                className={"w-11/12"}
                startDate={startDate}
                endDate={endDate}
                onChange={async (beginDate, endDate) =>
                  await setNewSchedules(beginDate, endDate)
                }
              />
              <PrimaryButton icon={faCirclePlus}>Nieuw</PrimaryButton>
            </div>
            <SelectionList
              Component={({ url, background, setSelected, callback, data }) => (
                <SmallTour
                  key={url}
                  background={background}
                  setSelected={setSelected}
                  callback={callback}
                  data={data}
                />
              )}
              title={"Rondes"}
              callback={() => {}}
              elements={schedules}
              selectedStart={url}
            />
          </div>
        </div>
      </div>
    </>
  );
}
