import Layout from "@/components/Layout";
import MobileLayout from "@/components/MobileLayout";
import Head from "next/head";
import Dropdown from "@/components/Dropdown";
import {
  faBicycle,
  faCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import scheduleService from "@/services/schedule.service";
import moment from "moment";
import userService from "@/services/user.service";
import tourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import VisitService from "@/services/visit.service";
import PhotoService from "@/services/photo.service";
import ProgressBar from "react-customizable-progressbar";
import CustomProgressBar from "@/components/ProgressBar";
import buildingService from "@/services/building.service";
import visit_finished from "@/services/visit_finished";
import ColoredTag from "@/components/Tag";
import { COLOR_DONE_1 } from "@/utils/colors";

export default function StudentPlanningPage() {
  const [name, setName] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [fraction, setFraction] = useState(0);
  const [names, setNames] = useState([]);
  const [schedules, setSchedules] = useState([]);

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
      if (buildings.length > 0) {
        const building_data = await Promise.all(
          buildings.map(async (entry) => {
            const result = {};
            const building = await buildingService.getEntryByUrl(
              entry["building"]
            );
            console.log(building);
            result["url"] = entry["building"];
            result["name"] = entry["building_data"]["nickname"];
            result[
              "address"
            ] = `${building["address_line_1"]} ${building["address_line_2"]}`;
            result["finished"] = false;
            return result;
          })
        );

        let count = 0;
        for (const visit of visits) {
          const buildInTour = await BuildingInTourService.getEntryByUrl(
            visit["building_in_tour"]
          );
          const photos = await visit_finished(visit.url);
          if (photos.length > 0) {
            const building = building_data.find(
              (entry) => entry["url"] === buildInTour["building"]
            );
            building["finished"] = true;
            count++;
          }
        }
        setBuildings(building_data);
        setName(buildings[0].tour_name);
        setFraction(count / buildings.length);
      }
      console.log(buildings);
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
      const schedules = await scheduleService.get({
        students: [user.url],
        startDate: dateFrom,
        endDate: dateTo,
      });
      const names = await Promise.all(
        schedules.map(async (entry) => {
          const tour = await tourService.getEntryByUrl(entry.tour);
          return tour.name;
        })
      );
      console.log(names);
      setNames(names);
      const scheduleUrls = schedules.map((entry) => entry.url);
      console.log(schedules);
      setSchedules(scheduleUrls);
    };
    allSchedules().catch();
  }, []);

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"h-full bg-dark-bg-2 flex flex-col py-6 px-3 space-y-4"}>
        <div
          className={
            "h-full w-full bg-dark-bg-1 rounded-lg p-6 flex flex-col justify-start items-center content-start space-y-12"
          }
        >
          <div
            className={
              "flex flex-col w-full justify-start items-center content-start space-y-3"
            }
          >
            <h1 className={"text-[35px] font-bold text-dark-text"}>Planning</h1>
            <h3 className={"text-lg font-bold text-dark-text"}>{name}</h3>

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
              >
                {name}
              </Dropdown>
              <div className={"w-full"}>
                <CustomProgressBar fraction={fraction} />
              </div>
            </div>
          </div>
          <div className={"w-full flex flex-col space-y-3"}>
            {buildings.map((data, index) => {
              return (
                <div
                  className={"font-bold rounded-lg w-full bg-light-h-2 p-3"}
                  key={index}
                >
                  <div className={"flex flex-row"}>
                    <h1 className={"font-bold text-lg"}>{data["name"]}</h1>
                    {data["finished"] ? (
                      <ColoredTag
                        className={
                          "bg-done-2 border-4 border-done-1 rounded-lg"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          size="lg"
                          style={{ color: COLOR_DONE_1 }}
                        />
                      </ColoredTag>
                    ) : (
                      <ColoredTag
                        className={"bg-bad-2 border-4 border-bad-1 rounded-lg"}
                      />
                    )}
                  </div>
                  <div className={"flex flex-row space-x-2"}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p>{data["address"]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
