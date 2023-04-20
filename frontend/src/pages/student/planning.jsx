import Layout from "@/components/Layout";
import MobileLayout from "@/components/MobileLayout";
import Head from "next/head";
import Dropdown from "@/components/Dropdown";
import { faBicycle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import scheduleService from "@/services/schedule.service";
import moment from "moment";
import userService from "@/services/user.service";
import tourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import VisitService from "@/services/visit.service";
import PhotoService from "@/services/photo.service";

export default function StudentPlanningPage() {
  const [buildings, setBuildings] = useState([]);
  const [names, setNames] = useState([]);
  const [schedules, setSchedules] = useState([]);

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

  async function setSchedule(item) {
    const url = item[0][1];
    console.log(url);
    const schedule = await scheduleService.getEntryByUrl(url);
    let split = url.trim().split("/");
    const visits = await scheduleService.getVisitsFromSchedule(
      split[split.length - 2]
    );
    let count = 0;
    for (const visit of visits) {
      const buildInTour = await BuildingInTourService.getEntryByUrl(
        visit["building_in_tour"]
      );
      const photos = await visit_finished(visit.url);
      if (photos.length > 0) {
        count++;
      }
    }

    split = schedule.tour.trim().split("/");
    let buildings = await tourService.getBuildingsFromTour(
      split[split.length - 2]
    );
    console.log(buildings);

    console.log(visits);
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
            "h-full w-full bg-dark-bg-1 rounded-lg p-6 flex flex-col justify-start items-center content-start space-y-3"
          }
        >
          <div
            className={
              "flex flex-col justify-start items-center content-start space-y-3"
            }
          >
            <h1 className={"text-[35px] font-bold text-dark-text"}>Planning</h1>
            <h3 className={"text-lg font-bold text-dark-text"}>
              Stations ronde
            </h3>
          </div>
          <Dropdown
            icon={faBicycle}
            options={names}
            optionsValues={schedules}
            onClick={async (item) => await setSchedule(item)}
          />
        </div>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
