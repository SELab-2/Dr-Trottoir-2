import MobileLayout from "@/components/MobileLayout";
import Head from "next/head";
import Dropdown from "@/components/Dropdown";
import {
  faBicycle,
  faCheck,
  faLocationDot,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import scheduleService from "@/services/schedule.service";
import moment from "moment";
import userService from "@/services/user.service";
import tourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import CustomProgressBar from "@/components/ProgressBar";
import buildingService from "@/services/building.service";
import ColoredTag from "@/components/Tag";
import { COLOR_BAD_1, COLOR_DONE_1 } from "@/utils/colors";
import WasteService from "@/services/waste.service";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import WasteCalendar from "@/components/Wastecalendar";
import MapView from "@/components/MapView";
import { useRouter } from "next/router";
import { urlToPK } from "@/utils/urlToPK";
import Image from "next/image";
import Cell from "@/components/table/Cell";
import WasteTag from "@/components/WasteTag";
import { checkVisitPhotos } from "@/utils/helpers";

export default function StudentPlanningPage() {
  const [name, setName] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [fraction, setFraction] = useState(0);
  const [names, setNames] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const router = useRouter();

  /**
   * Will set the need information of a selected schedule like
   * which buildings are in the schedule and which kind of waste needs to be handled on a certain day.
   * @param item A 2d list with only on list in it (because of dropdown component).
   *             The first element in the list is the name of the schedule + date and the second element is the url of the schedule
   *             Example: [[Station ronde (2023-05-01), http://localhost:8000/api/schedule/2/]]
   */
  async function setSchedule(item) {
    const content = item[0];
    if (content) {
      const url = content[1];
      const schedule = await scheduleService.getEntryByUrl(url);
      let split = url.trim().split("/");
      const visits = await scheduleService.getVisitsFromSchedule(
        split[split.length - 2]
      );

      split = schedule.tour.trim().split("/");
      let buildings = await tourService.getBuildingsFromTour(
        split[split.length - 2]
      );
      // For every building it'll collect all the needed data to display on screen
      if (buildings.length > 0) {
        const building_data = await Promise.all(
          buildings.map(async (entry) => {
            const result = {};
            const building = await buildingService.getEntryByUrl(
              entry["building"]
            );
            result["url"] = entry["building"];
            result["name"] = entry["building_data"]["nickname"];
            result[
              "address"
            ] = `${building["address_line_1"]} ${building["address_line_2"]}`;
            result["finished"] = false;
            result["waste"] = await WasteService.get({
              building: entry["building"],
              startDate: moment(new Date()).startOf("day").toDate(),
              endDate: moment(new Date()).endOf("day").toDate(),
            });
            return result;
          })
        );

        let count = 0;
        // It'll also look at which buildings are finished
        for (const visit of visits) {
          const buildInTour = await BuildingInTourService.getEntryByUrl(
            visit["building_in_tour"]
          );
          const result = await checkVisitPhotos(visit.url);
          if (result !== null) {
            const building = building_data.find(
              (entry) => entry["url"] === buildInTour["building"]
            );
            building["finished"] = true;
            count++;
          }
        }
        setBuildings(building_data);
        setName(content[0]);
        setFraction(count / buildings.length);
      }
    }
  }

  useEffect(() => {
    const allSchedules = async () => {
      let { user } = await getSession();
      const split = user.url.trim().split("/");
      user = await userService.getById(split[split.length - 2]);
      const date = new Date();
      const dateFrom = moment(date).startOf("isoWeek").toDate();
      const dateTo = moment(date).endOf("isoWeek").toDate();
      // Get every schedule assigned to the current user in this week
      const schedules = await scheduleService.get({
        students: [user.url],
        startDate: dateFrom,
        endDate: dateTo,
      });
      const names = await Promise.all(
        schedules.map(async (entry) => {
          const tour = await tourService.getEntryByUrl(entry.tour);
          return `${tour.name} (${entry.date})`;
        })
      );
      setNames(names);
      const scheduleUrls = schedules.map((entry) => entry.url);
      setSchedules(scheduleUrls);
      if (scheduleUrls.length > 0) {
        await setSchedule([[names[0], scheduleUrls[0]]]);
      }
    };
    allSchedules().catch();
  }, []);

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"h-full flex flex-col py-6 px-3 space-y-4"}>
        <MapView
          route={buildings.map((building) => building["address"])}
          transportationMode={"bicycling"}
        />
        <PrimaryCard
          className={
            "h-full w-full rounded-lg p-6 flex flex-col justify-start items-center content-start space-y-12"
          }
        >
          <div
            className={
              "flex flex-col w-full justify-start items-center content-start space-y-3"
            }
          >
            <div
              className={
                "w-full flex flex-col justify-start items-center content-start space-y-6 mt-5"
              }
            >
              <Dropdown
                icon={faBicycle}
                options={names}
                optionsValues={schedules}
                onClick={async (item) => await setSchedule(item)}
                className={"w-full"}
              >
                {name}
              </Dropdown>
              <div className={"w-full"}>
                <CustomProgressBar fraction={fraction} />
              </div>
            </div>
          </div>
          <div
            className={
              "w-full h-full flex flex-col space-y-3 overflow-y-scroll"
            }
          >
            {buildings.map((data, index) => {
              return (
                <SecondaryCard
                  className={
                    "font-bold rounded-lg w-full h-full p-3 space-y-2 flex flex-col overflow-visible"
                  }
                  key={index}
                >
                  <div
                    className={"flex flex-row cursor-pointer"}
                    onClick={() =>
                      router.push(`/student/gebouw/${urlToPK(data.url)}`)
                    }
                  >
                    <h1 className={"font-bold text-lg w-full"}>
                      {data["name"]}
                    </h1>
                    {data["finished"] ? (
                      <ColoredTag
                        className={
                          "bg-done-2 border-4 border-done-1 rounded-lg w-hidden"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          size={"2xs"}
                          style={{ color: COLOR_DONE_1 }}
                        />
                      </ColoredTag>
                    ) : (
                      <ColoredTag
                        className={"bg-bad-2 border-4 border-bad-1 rounded-lg"}
                      >
                        <FontAwesomeIcon
                          icon={faX}
                          size={"2xs"}
                          style={{ color: COLOR_BAD_1 }}
                        />
                      </ColoredTag>
                    )}
                  </div>
                  <div className={"flex flex-row space-x-2"}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p>{data["address"]}</p>
                  </div>
                  <div className={"flex flex-row space-x-2"}>
                    <div className={"flex flex-col"}>
                      {data["waste"]
                        .filter((entry) => entry.action === "Buiten")
                        .map((entry, index) => (
                          <div className={"shrink-0"} key={index}>
                            <WasteTag entry={entry} />
                          </div>
                        ))}
                    </div>
                    <div className={"flex flex-col"}>
                      {data["waste"]
                        .filter((entry) => entry.action === "Binnen")
                        .map((entry, index) => (
                          <div className={"shrink-0"} key={index}>
                            <WasteTag entry={entry} />
                          </div>
                        ))}
                    </div>
                  </div>
                </SecondaryCard>
              );
            })}
          </div>
        </PrimaryCard>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
