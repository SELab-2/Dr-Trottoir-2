import Head from "next/head";
import {
  faBriefcase,
  faCirclePlus,
  faEnvelope,
  faLocationDot,
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

function SmallTour({ data, callback, setSelected, background }) {
  const url = data["url"];
  let name = "";
  let amount = 1;
  let finished = 0;
  if (data !== undefined) {
    name = data["name"];
    if (data["amount"] > 0) {
      amount = data["amount"];
    }
    finished = data["finished"];
  }
  function handleClick() {
    setSelected(url);
    callback();
  }

  return (
    <div
      data-testid="small-tour"
      className={"p-4 rounded-lg space-y-3 cursor-pointer"}
      style={{ backgroundColor: background }}
      onClick={handleClick}
    >
      <h1 className={"font-semibold"}>{name}</h1>
      <CustomProgressBar fraction={finished / amount} />
    </div>
  );
}

export default function AdminTourPage() {
  const [user, setUser] = useState({});
  const [week, setWeek] = useState([]);
  const [finished, setfinished] = useState(0);
  const [buildings, setBuildings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [response, setResponse] = useState("{}");
  const [tours, setTours] = useState([]);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  async function visit_finished(url) {
    const split = url.trim().split("/");
    const photoUrls = await VisitService.getPhotosByVisit(
      split[split.length - 2]
    );
    const photos = await Promise.all(
      photoUrls["photos"].map(async (entry) => {
        const split = entry.trim().split("/");
        return await PhotoService.getPhotoById(split[split.length - 2]);
      })
    );

    return photos.filter((entry) => entry["state"] === 2);
  }

  useEffect(() => {
    const allTours = async () => {
      if (!router.isReady) return;
      const planning = router.query["pid"];
      const scheduleResponse = await ScheduleService.getScheduleById(planning);
      // Set the week.
      const date = scheduleResponse.date;
      const dateFrom = moment(date).startOf("isoWeek").toDate();
      const dateTo = moment(date).endOf("isoWeek").toDate();
      // Looking for all the visits in this tour.
      const scheduleVisits = await ScheduleService.getVisitsFromSchedule(
        planning
      );
      console.log(scheduleResponse);
      console.log(scheduleVisits);
      setWeek([dateFrom, dateTo]);

      // counting the amount of visits that are finished
      let count = 0;
      const comments = [];
      const time = {};
      for (let i in scheduleVisits) {
        const visit = scheduleVisits[i];
        if (visit.comment !== "") {
          comments.push({
            comment: visit.comment,
            building: visit.building_in_tour_data.nickname,
          });
        }
        const buildInTour = await BuildingInTourService.getBuildingInTourById();
        const photos = await visit_finished(visit.url);
        if (photos.length > 0) {
          const diff =
            new Date(photos[0]["created_at"]) - new Date(visit["arrival"]);
          let seconds = Math.round(diff / 1000);
          const minutes = Math.round(seconds / 60);
          seconds -= minutes * 60;
          console.log(minutes)
          console.log(seconds)
          count++;
        }
      }
      console.log(scheduleVisits)
      setComments(comments);
      setfinished(count);

      // Searching the buildings of this tour
      let split = scheduleResponse["tour"].trim().split("/");
      const buildingIds = await TourService.getBuildingsFromTour(
        split[split.length - 2]
      );
      const buildings = [];
      for (let i in buildingIds["buildings"]) {
        const building = await BuildingService.getBuildingById(
          buildingIds["buildings"][i]
        );
        let time = "TBA";
        let status = "Onderweg";
        const owners = building["owners"]
          .map(
            (entry) => `${entry.first_name} ${entry.last_name} (${entry.email})`
          )
          .join(", ");
        console.log(owners);
        buildings.push([
          building.nickname,
          `${building.address_line_1}\n${building.address_line_2}`,
          status,
          owners,
          time,
        ]);
      }
      setBuildings(buildings);
      console.log(buildings);

      // We set the user for this specific tour.
      split = scheduleResponse["student"].trim().split("/");
      console.log(scheduleResponse);
      const userResponse = await UserService.getUserById(
        split[split.length - 2]
      );
      setUser(userResponse);
      console.log(userResponse);

      const response = await TourService.getAll();
      //setTours(JSON.stringify(response, null, 2))
      const btResponse = await BuildingInTourService.getAll();
      const visitResponse = await VisitService.getAll();
      const tour = [];

      if (
        response.hasOwnProperty("results") &&
        btResponse.hasOwnProperty("results") &&
        visitResponse.hasOwnProperty("results")
      ) {
        const list = response["results"];
        const visits = visitResponse["results"].map(
          (entry) => entry["building_in_tour"]
        );
        console.log(visits);

        for (let i in list) {
          let finished = 0;
          const entry = list[i];
          const url = entry["url"];
          const buildings = btResponse["results"]
            .filter((entry) => entry["tour"] === url)
            .map((entry) => entry["url"]);
          for (let i = 0; i < buildings.length; i++) {
            for (let j = 0; j < visits.length; j++) {
              if (visits[j] === buildings[i]) {
                finished++;
              }
            }
          }
          tour.push({
            url: url,
            name: entry["name"],
            amount: buildings.length,
            finished: finished,
          });
        }
      }
      setTours(tour);
    };
    allTours().catch();
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"h-full bg-light-bg-2 flex flex-col py-6 px-3 space-y-4"}>
        <div className={"h-full bg-light-bg-2 flex flex-row space-x-2"}>
          <PrimaryCard
            className={"w-9/12 h-full flex flex-col"}
            title={"Details"}
          >
            <div className={" space-y-4 h-full"}>
              <h1 className={"text-light-h-1 font-bold text-lg"}>
                Stations Ronde
              </h1>
              <div className={"flex flex-row space-x-2 h-3/6"}>
                <div className={"flex flex-col space-y-2 h-full"}>
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
                            className={"h-4  mt-1 mx-2"}
                          />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </SecondaryCard>
                  <SecondaryCard
                    className={
                      "h-4/6 items-center items-center justify-center overflow-hidden"
                    }
                    icon={faBriefcase}
                    title={"Progress"}
                  >
                    <div
                      className={"flex flex-row items-center justify-center"}
                    >
                      <CustomProgressBar
                        is_wheel
                        circleWidth={150}
                        radius={50}
                        className={"flex-shrink w-1/6 h-1/6"}
                        fraction={finished / buildings.length}
                      />
                      <h1 className={"text-light-h-1 font-bold text-base"}>
                        {finished}/{buildings.length} Gebouwen klaar
                      </h1>
                    </div>
                  </SecondaryCard>
                </div>

                <SecondaryCard
                  icon={faLocationDot}
                  title={"Opmerkingen"}
                  className={"h-full flex flex-col"}
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

                <SecondaryCard icon={faLocationDot} title={"Wegbeschrijving"}>
                  <p>The gift card is shattered</p>
                </SecondaryCard>
              </div>
              <SecondaryCard icon={faBriefcase} title={"Gebouwen"}>
                <CustomTable
                  className={"w-full"}
                  cutLen={"[200px]"}
                  columns={[
                    { name: "Naam" },
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
            <div className={"flex flex-row"}>
              <CustomWeekPicker range={week} />
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
              callback={() => {
                console.log("callback is called!");
              }}
              elements={tours}
            />
          </div>
        </div>
      </div>
    </>
  );
}
