import Layout from "@/components/Layout";
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
import { getSession, useSession } from "next-auth/react";
import scheduleService from "@/services/schedule.service";
import moment from "moment";
import userService from "@/services/user.service";
import tourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import VisitService from "@/services/visit.service";
import PhotoService from "@/services/photo.service";
import CustomProgressBar from "@/components/ProgressBar";
import buildingService from "@/services/building.service";
import visit_finished from "@/utils/visit_finished";
import ColoredTag from "@/components/Tag";
import { COLOR_BAD_1, COLOR_DONE_1 } from "@/utils/colors";
import WasteService from "@/services/waste.service";
import Cell from "@/components/table/Cell";

export default function StudentPlanningPage() {
  const [name, setName] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [fraction, setFraction] = useState(0);
  const [names, setNames] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [dates, setDates] = useState([]);

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
            result["url"] = entry["building"];
            result["name"] = entry["building_data"]["nickname"];
            result[
              "address"
            ] = `${building["address_line_1"]} ${building["address_line_2"]}`;
            result["finished"] = false;
            result["waste"] = await WasteService.get({
              building: entry["building"],
              startDate: moment(new Date()).startOf("isoWeek").toDate(),
              endDate: moment(new Date()).endOf("isoWeek").toDate(),
            });
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
      const dates = [];
      let currentDate = new Date(dateFrom);
      while (currentDate <= dateTo) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setDates(dates);
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
      setNames(names);
      const scheduleUrls = schedules.map((entry) => entry.url);
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
          <div className={"w-full flex flex-col space-y-3 overflow-auto"}>
            {buildings.map((data, index) => {
              return (
                <div
                  className={
                    "font-bold rounded-lg w-full h-full bg-light-h-2 p-3 space-y-2"
                  }
                  key={index}
                >
                  <div className={"flex flex-row"}>
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
                          style={{ color: COLOR_DONE_1 }}
                        />
                      </ColoredTag>
                    ) : (
                      <ColoredTag
                        className={"bg-bad-2 border-4 border-bad-1 rounded-lg"}
                      >
                        <FontAwesomeIcon
                          icon={faX}
                          size={"lg"}
                          style={{ color: COLOR_BAD_1 }}
                        />
                      </ColoredTag>
                    )}
                  </div>
                  <div className={"flex flex-row space-x-2"}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p>{data["address"]}</p>
                  </div>
                  <div className={"flex flex-row space-x-2 w-full h-auto"}>
                    {dates.map((date, i) => {
                      const waste = data["waste"].filter((entry) => {
                        const wasteDate = new Date(entry.date);
                        const day = wasteDate.getDay();
                        const month = wasteDate.getMonth();
                        const year = wasteDate.getFullYear();
                        return (
                          day === date.getDay() &&
                          month === date.getMonth() &&
                          year === date.getFullYear()
                        );
                      });
                      return (
                        <div
                          key={i}
                          className={
                            "flex flex-col flex-auto bg-light-bg-1 w-full p-1 rounded-lg items-center"
                          }
                        >
                          {waste.map((entry, index) => {
                            let classname = "bg-waste-other text-light-bg-1";
                            let cut = true;
                            if (entry.waste_type.toUpperCase() === "PMD") {
                              classname = "bg-waste-PMD text-light-text";
                              cut = false;
                            } else if (
                              entry.waste_type.toUpperCase() === "GLAS"
                            ) {
                              classname = "bg-waste-glass text-light-text";
                              cut = false;
                            } else if (
                              entry.waste_type.toUpperCase() === "PAPIER"
                            ) {
                              classname = "bg-waste-paper text-light-bg-1";
                            } else if (
                              entry.waste_type.toUpperCase() === "REST"
                            ) {
                              classname = "bg-waste-rest text-light-bg-1";
                              cut = false;
                            }
                            return (
                              <ColoredTag
                                key={index}
                                className={`rounded-lg w-full text-center overflow-hidden ${classname}`}
                              >
                                <Cell cut={cut} maxWidth={"30"}>
                                  <p className={classname}>
                                    {entry.waste_type}
                                  </p>
                                </Cell>
                              </ColoredTag>
                            );
                          })}
                        </div>
                      );
                    })}
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
