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

export default function StudentPlanningPage() {
  const [schedule, setSchedules] = useState([]);

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
          <Dropdown icon={faBicycle} options={schedule} />
        </div>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
