import Head from "next/head";
import {
  faBriefcase,
  faEnvelope,
  faLocationDot,
  faPenToSquare,
  faFilter,
  faSort,
  faSearch,
  faPlusCircle,
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
import Layout from "@/components/Layout";
import Dropdown from "@/components/Dropdown";
import InputField from "@/components/input-fields/InputField";
import SecondaryButton from "@/components/button/SecondaryButton";
import { urlToPK } from "@/utils/urlToPK";
import { checkVisitPhotos } from "@/utils/helpers";

/**
 * Return small tour component to place in the selection list.
 * @param data The object needed to make a SmallTour component.
 * @param background The object needed to make a SmallTour component.
 */
function SmallTour({ data, background }) {
  const date = new Date(data.date);

  return (
    <div className={"rounded-lg"} style={{ backgroundColor: background }}>
      <Link href={`/beheer/planningen/${encodeURI(data.id)}/`}>
        <div className={"px-4 py-4"}>
          <h1 className={"font-semibold pb-2"}>{data.name}</h1>
          <h2 className={"pb-2"}>
            {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}
          </h2>
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
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [finished, setFinished] = useState(0);
  const [buildings, setBuildings] = useState([]);
  const [comments, setComments] = useState([]);
  const searchString = useRef("");
  const [sortString, setSortString] = useState("");
  const [filterString, setFilterString] = useState("");
  const router = useRouter();

  const stringToField = {
    Ronde: "name",
    Datum: "date",
  };

  const performSearch = (scheduleEntries, sortField, filtering) => {
    // Filters on input field
    console.log("print");
    console.log(searchString.current);
    if (searchString.current && searchString.current !== "") {
      const search = searchString.current.value.toLowerCase();
      scheduleEntries = scheduleEntries.filter((entry) =>
        entry.name.toLowerCase().includes(search)
      );
      console.log(scheduleEntries);
    }
    // Sorts based on the given sortField
    if (sortField !== "") {
      scheduleEntries = scheduleEntries.sort(function (a, b) {
        const field = stringToField[sortField];
        return a[field].localeCompare(b[field]);
      });
    }
    // Perform filtering based on completeness
    scheduleEntries = filterSchedules(scheduleEntries, filtering);
    setFilteredSchedules(scheduleEntries);
  };

  const performSort = (sort) => {
    const newSort = sort.length > 0 ? sort[0] : "";
    setSortString(newSort);
    performSearch(schedules, newSort, filterString);
  };

  const performFilter = (filtering) => {
    const newFilter = filtering.length > 0 ? filtering[0] : "";
    setFilterString(newFilter);
    performSearch(schedules, sortString, newFilter);
  };

  const filterSchedules = (schedules, filtering) => {
    if (filtering === "Nog niet begonnen") {
      return schedules.filter((schedule) => schedule.finished === 0);
    }
    if (filtering === "Onderweg") {
      return schedules.filter((schedule) => {
        const completeness = schedule.finished / schedule.amount;
        return completeness > 0 && completeness < 1;
      });
    }
    if (filtering === "Compleet") {
      return schedules.filter(
        (schedule) => schedule.finished / schedule.amount === 1
      );
    }
    return schedules;
  };
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
    setFilteredSchedules(schedulesList);
    setStart(dateFrom);
    setEnd(dateTo);
  }

  /**
   * We define all the data needed to make a SmallTour component in the selection list.
   * @param data The schedule object we are getting the needed information from.
   * @return list The resulting object that will be used in the SmallTour component.
   */
  const parseTour = async (data) => {
    const result = {
      url: data["url"],
      id: urlToPK(data["url"]),
      date: data["date"],
    };
    const tour = await TourService.getEntryByUrl(data["tour"]);
    result["name"] = tour["name"];
    const buildingIds = await TourService.getBuildingsFromTour(
      urlToPK(data["tour"])
    );

    result["amount"] = 1;
    if (buildingIds.length > 0) result["amount"] = buildingIds.length;
    const scheduleVisits = await ScheduleService.getVisitsFromSchedule(
      urlToPK(data["url"])
    );
    let count = 0;
    for (const visit of scheduleVisits) {
      const response = await checkVisitPhotos(visit.url);
      if (response !== null) {
        count++;
      }
    }
    result["finished"] = count;
    return result;
  };

  useEffect(() => {
    const allTours = async () => {
      setNewSchedules(
        moment(new Date()).startOf("isoWeek").toDate(),
        moment(new Date()).endOf("isoWeek").toDate()
      );
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
        const visitCommentResponse = await VisitService.getCommentsFromVisit(
          id
        );
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
          console.log(photo);
          if (photo.comment !== "" && photo.comment !== null) {
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
        const LastTime = await checkVisitPhotos(visit.url);
        if (LastTime !== null) {
          const diff = LastTime - new Date(visit["arrival"]);
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
        comments.push({
          comment: comment.text,
          building: building.nickname,
          user: `${user.first_name} ${user.last_name}`,
          last_update: new Date(comment.updated_at),
        });
      }
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
            building.url,
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
              options={["Nog niet begonnen", "Onderweg", "Compleet"]}
              onClick={performFilter}
            >
              Filter
            </Dropdown>
            <Dropdown
              icon={faSort}
              text={"Sort"}
              className={"mr-2"}
              onClick={performSort}
              options={["Datum", "Ronde"]}
            >
              Sort
            </Dropdown>
            <InputField
              classNameDiv={"w-80"}
              reference={searchString}
              icon={faSearch}
              actionCallback={() =>
                performSearch(schedules, sortString, filterString)
              }
            />
          </div>
          <PrimaryButton
            icon={faPlusCircle}
            text={"Sort"}
            onClick={async () =>
              await router.push("/beheer/data_toevoegen/planningen")
            }
          >
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
                <SecondaryButton
                  icon={faPenToSquare}
                  className={"h-fit"}
                  onClick={async () =>
                    await router.push(
                      `/beheer/data_toevoegen/planningen/${urlToPK(url)}`
                    )
                  }
                >
                  Bewerk
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
                <div className={"space-y-2  overflow-auto"}>
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
                <div className={"w-full h-[84%] overflow-hidden"}>
                  <MapView
                    route={buildings.map((building) => building[1])}
                    transportationMode={"bicycling"}
                    className={"w-[100%] h-[100%]"}
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
                  {
                    name: "Detail",
                    createCell: (url) => (
                      <Link
                        className={
                          "bg-primary-2 border-2 border-light-h-2 rounded-lg p-1"
                        }
                        href={`/beheer/gebouwen/${urlToPK(url)}`}
                      >
                        Detail
                      </Link>
                    ),
                  },
                ]}
                data={buildings}
              />
            </SecondaryCard>
          </div>
        </PrimaryCard>

        <div className={"space-y-2 basis-1/4 m-2 flex flex-col"}>
          <PrimaryCard title={"Selecteer week"} className={"mb-3"}>
            <CustomWeekPicker
              className={"w-full"}
              startDate={startDate}
              endDate={endDate}
              onChange={async (beginDate, endDate) =>
                await setNewSchedules(beginDate, endDate)
              }
            />
          </PrimaryCard>
          <SelectionList
            Component={({ url, background, setSelected, callback, data }) => (
              <SmallTour key={url} background={background} data={data} />
            )}
            callback={() => {}}
            elements={filteredSchedules}
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
