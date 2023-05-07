import Head from "next/head";
import {
  faBriefcase,
  faEnvelope,
  faLocationDot,
  faTrash,
  faPenToSquare,
  faFilter,
  faSort,
  faSearch,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SelectionList from "@/components/selection/SelectionList";
import { useEffect, useState } from "react";
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
import Layout from "@/components/Layout";
import Dropdown from "@/components/Dropdown";
import InputField from "@/components/input-fields/InputField";
import SecondaryButton from "@/components/button/SecondaryButton";
import { urlToPK } from "@/utils/urlToPK";

/**
 * Return small tour component to place in the selection list.
 * @param data The object needed to make a SmallTour component.
 * @param background The object needed to make a SmallTour component.
 */
function SmallTour({ data, background }) {
  return (
    <div className={"rounded-lg"} style={{ backgroundColor: background }}>
      <Link href={`/admin/planningen/${encodeURI(data.id)}/`}>
        <div className={"px-4 py-4"}>
          <h1 className={"font-semibold pb-2"}>{data.name}</h1>
          <CustomProgressBar fraction={data.finished / data.amount} />
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

  /**
   * We fill the selection list wih new schedule objects based on the given week.
   * @param dateFrom Start of the week.
   * @param dateTo End of the week.
   */
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

  /**
   * We put all the photos of state departure of a visit in a list and return it.
   * @param url The url of the visit object.
   * @return list The list of photos with state departure.
   */
  async function visit_finished(url) {
    const split = url.trim().split("/");
    const photoUrls = await VisitService.getPhotosByVisit(
      split[split.length - 2]
    );

    const photos = await Promise.all(
      photoUrls.map(async (entry) => {
        return await PhotoService.getEntryByUrl(entry.url);
      })
    );

    return photos.filter((entry) => entry["state"] === 2);
  }

  /**
   * We define all the data needed to make a SmallTour component in the selection list.
   * @param data The schedule object we are getting the needed information from.
   * @return list The resulting object that will be used in the SmallTour component.
   */
  const parseTour = async (data) => {
    let split = data["url"].trim().split("/");
    const id = split[split.length - 2];
    const result = { url: data["url"], id: id, date: data["date"] };
    const tour = await TourService.getEntryByUrl(data["tour"]);
    result["name"] = tour["name"];
    split = data["tour"].trim().split("/");
    const buildingIds = await TourService.getBuildingsFromTour(
      split[split.length - 2]
    );

    result["amount"] = 1;
    if (buildingIds.length > 0) result["amount"] = buildingIds.length;
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
      setStart(dateFrom);
      setEnd(dateTo);
      // We set the user that is doing this specific tour.
      const userResponse = await UserService.getEntryByUrl(
        scheduleResponse["student"]
      );
      setUser(userResponse);

      // Using the set week we make the data needed to fill the selection list.
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

      // Get all the comments of a visit and calculating the time taken for a finished visit.
      const scheduleVisits = await ScheduleService.getVisitsFromSchedule(
        planning
      );
      const comments = [];
      const time = {};
      for (const visit of scheduleVisits) {
        let split = visit.url.trim().split("/");
        const id = split[split.length - 2];
        const visitCommentResponse = await VisitService.getCommentsByVisit(id);
        for (const comment of visitCommentResponse) {
          const user = await UserService.getEntryByUrl(comment.user);
          if (comment.text !== "") {
            comments.push({
              comment: comment.text,
              building: visit.building_in_tour_data.nickname,
              user: `${user.first_name} ${user.last_name}`,
              last_update: new Date(comment.updated_at),
            });
          }
        }
        split = url.trim().split("/");
        const photoUrls = await VisitService.getPhotosByVisit(
          urlToPK(visit.url)
        );

        const photos = await Promise.all(
          photoUrls.map(async (entry) => {
            return await PhotoService.getEntryByUrl(entry.url);
          })
        );

        for (const photo of photos) {
          if (photo.comment !== "") {
            comments.push({
              comment: photo.comment,
              building: visit.building_in_tour_data.nickname,
              user: `${userResponse.first_name} ${userResponse.last_name}`,
              last_update: new Date(photo.created_at),
            });
          }
        }

        const buildInTour = await BuildingInTourService.getEntryByUrl(
          visit["building_in_tour"]
        );
        time[buildInTour["building"]] = "TBA";
        const departurePhotos = await visit_finished(visit.url);
        if (departurePhotos.length > 0) {
          const diff =
            new Date(departurePhotos[0]["created_at"]) -
            new Date(visit["arrival"]);
          let seconds = Math.round(diff / 1000);
          const minutes = Math.floor(seconds / 60);
          seconds -= minutes * 60;
          time[buildInTour["building"]] = `${minutes}m${seconds}s`;
        }
      }
      const scheduleCommentResponse =
        await ScheduleService.getCommentsFromSchedule(planning);
      for (const comment of scheduleCommentResponse) {
        const building = await BuildingService.getEntryByUrl(comment.building);
        const user = await UserService.getEntryByUrl(comment.user);
        console.log(user);
        comments.push({
          comment: comment.text,
          building: building.nickname,
          user: `${user.first_name} ${user.last_name}`,
          last_update: new Date(comment.updated_at),
        });
      }
      console.log(comments);
      setComments(comments);

      // Searching the buildings of this tour
      let split = scheduleResponse["tour"].trim().split("/");
      const buildingIds = await TourService.getBuildingsFromTour(
        split[split.length - 2]
      );
      // All the data needed is being set here to fill the table.
      const buildings = await Promise.all(
        buildingIds.map(async (buildingData) => {
          const building = await BuildingService.getEntryByUrl(
            buildingData.building
          );
          let computedTime = time[buildingData.building];
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
    };
    allTours().catch();
  }, [router.isReady, router]);

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <PrimaryCard className={"m-2"}>
        <div className={"flex justify-between"}>
          <div className={"flex"}>
            <Dropdown
              icon={faFilter}
              text={"Filter"}
              className={"mr-2"}
              options={[]}
            >
              Filter
            </Dropdown>
            <Dropdown
              icon={faSort}
              text={"Sort"}
              className={"mr-2"}
              options={[]}
            >
              Sort
            </Dropdown>
            <InputField
              classNameDiv={"w-80"}
              reference={() => {}}
              icon={faSearch}
              actionCallback={() => {}}
            />
          </div>
          <PrimaryButton icon={faPlusCircle} text={"Sort"}>
            Nieuw
          </PrimaryButton>
        </div>
      </PrimaryCard>
      <div className={"flex"}>
        <PrimaryCard
          className={"m-2 basis-3/4 h-3/5 overflow-auto"}
          title={"Details"}
        >
          <div>
            <div className={"flex flex items-center"}>
              <h1 className={"w-full text-light-h-1 font-bold text-xl my-2"}>
                {name}
              </h1>
              <div className={"flex space-x-2"}>
                <SecondaryButton icon={faPenToSquare} className={"h-fit"}>
                  Bewerk
                </SecondaryButton>
                <SecondaryButton icon={faTrash} className={"h-fit"}>
                  Verwijder
                </SecondaryButton>
              </div>
            </div>
            <div className={"flex space-x-2 my-4"}>
              <div className={"flex flex-col space-y-2 basis-1/3"}>
                <SecondaryCard
                  className={"basis-2/5"}
                  icon={faBriefcase}
                  title={"Aangeduide student"}
                >
                  <div className={"flex space-x-4 my-2"}>
                    <ProfilePicture />
                    <div>
                      <h1 className={"text-light-h-1 font-bold text-base"}>
                        {user.first_name} {user.last_name}
                      </h1>
                      <div className={"flex flex-row space-x-4"}>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className={"h-4 mt-1 mr-2"}
                        />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </SecondaryCard>
                <SecondaryCard
                  className={"basis-3/5 overflow-hidden"}
                  icon={faBriefcase}
                  title={"Progress"}
                >
                  <div className={"flex justify-center items-center pb-2"}>
                    <div
                      className={"flex items-center justify-center space-x-2"}
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
                        {finished}/{buildings.length} klaar
                      </h1>
                    </div>
                  </div>
                </SecondaryCard>
              </div>

              <SecondaryCard
                icon={faLocationDot}
                title={"Opmerkingen"}
                className={"sm:w-2/6 basis-1/3"}
              >
                <div className={"space-y-2 overflow-auto"}>
                  {comments.map((entry, index) => (
                    <div key={index} className={"rounded-lg bg-light-bg-1 p-2"}>
                      <div className={"flex flex-row"}>
                        <h1 className={"w-full font-bold"}>{entry.user}</h1>
                        <h1
                          className={
                            "text-dark-text text-base w-full text-right"
                          }
                        >
                          {entry.building}
                        </h1>
                      </div>
                      <p className={"text-dark-text"}>
                        Laats aangepast:{" "}
                        {new Date(entry.last_update).toDateString()}{" "}
                        {new Date(entry.last_update).getHours()}:
                        {new Date(entry.last_update).getMinutes()}:
                        {new Date(entry.last_update).getSeconds()}
                      </p>
                      <Cell cut cutLen={"[300px]"}>
                        {entry.comment}
                      </Cell>
                    </div>
                  ))}
                </div>
              </SecondaryCard>

              <SecondaryCard
                className={"basis-1/3"}
                icon={faLocationDot}
                title={"Wegbeschrijving"}
              >
                <div className={"w-full h-[84%] relative overflow-hidden"}>
                  <MapView
                    route={buildings.map((building) => building[1])}
                    className={
                      "w-[150%] h-[200%] absolute top-[-50%] left-[-25%]"
                    }
                  />
                </div>
              </SecondaryCard>
            </div>

            <SecondaryCard
              className={"h-full"}
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
                        <ColoredTag className={className}>{status}</ColoredTag>
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

        <div className={"space-y-2 basis-1/4 m-2 flex flex-col"}>
          <CustomWeekPicker
            className={"w-full"}
            startDate={startDate}
            endDate={endDate}
            onChange={async (beginDate, endDate) =>
              await setNewSchedules(beginDate, endDate)
            }
          />
          <SelectionList
            Component={({ url, background, setSelected, callback, data }) => (
              <SmallTour key={url} background={background} data={data} />
            )}
            callback={() => {}}
            elements={schedules}
            selectedStart={url}
            className={"grow"}
            title={"Rondes"}
          />
        </div>
      </div>
    </>
  );
}

AdminTourPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
