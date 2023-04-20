import Head from "next/head";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import CustomInputField from "@/components/input-fields/InputField";
import {
  faFilter,
  faMagnifyingGlass,
  faPlusCircle,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";
import { useEffect, useState } from "react";
import ScheduleService from "@/services/schedule.service";
import CustomTable from "@/components/table/Table";
import { getMonday, getSunday } from "@/utils/helpers";
import TourService from "@/services/tour.service";
import UserService from "@/services/user.service";
import CustomProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { urlToPK } from "@/utils/urlToPK";
import Layout from "@/components/Layout";

export default function AdminDashboardPage() {
  const [schedule, setSchedule] = useState([]);
  const [startDate, setStartDate] = useState(getMonday(new Date()));
  const [endDate, setEndDate] = useState(getSunday(new Date()));

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      let schedules = await ScheduleService.get({
        startDate: startDate,
        endDate: endDate,
      });

      // construct the data for the table
      const columns = await Promise.all(
        schedules.map(async (schedule) => {
          const tour = await TourService.getEntryByUrl(schedule.tour);
          const student = await UserService.getEntryByUrl(schedule.student);
          const visits = await ScheduleService.getVisitsFromSchedule(
            urlToPK(schedule.url)
          );
          const buildings = await TourService.getBuildingsFromTour(
            urlToPK(tour.url)
          );
          return [
            schedule.date,
            tour.name,
            student.first_name,
            <div key={schedule.url} className={"flex flex-row space-x-4"}>
              <div className={"flex-grow"}>
                <CustomProgressBar
                  fraction={visits.length / buildings.length}
                  is_wheel={false}
                />
              </div>
              <p>
                {visits.length} / {buildings.length}
              </p>
            </div>,
            <Link
              key={schedule.url}
              href={`/admin/planning/${urlToPK(schedule.url)}`}
              className={"bg-primary-2 border-2 rounded-lg p-1"}
            >
              Details
            </Link>,
          ];
        })
      );
      setSchedule(columns);
    }
    fetchData().catch();
  }, [endDate, startDate]);

  const dummy = () => console.log("Dummy");

  return (
    <div className={"w-full h-full p-2 flex flex-col"}>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"flex pb-2"}>
        <CustomWeekPicker
          startDate={startDate}
          endDate={endDate}
          onChange={(newStartDate, newEndDate) => {
            setStartDate(newStartDate);
            setEndDate(newEndDate);
          }}
        />
      </div>

      <PrimaryCard>
        <div id={"statistics"} className={"flex flex-row grid grid-cols-3"}>
          <SecondaryCard
            title={"Aantal Rondes"}
            className={"m-2 justify-center items-center"}
          >
            {schedule.length === 1 ? (
              <p className={"font-bold"}>{schedule.length} Ronde</p>
            ) : (
              <p className={"font-bold"}>{schedule.length} Rondes</p>
            )}
          </SecondaryCard>
          <SecondaryCard title={"Aantal opmerkingen"} className={"m-2"}>
            <p>TODO</p>
          </SecondaryCard>
          <SecondaryCard title={"Overview"} className={"m-2"}>
            <p>TODO</p>
          </SecondaryCard>
        </div>

        <SecondaryCard title={"Rondes"} className={"m-2"}>
          {schedule.length ? (
            <div className={"flex flex-col"}>
              <PrimaryCard>
                <div className={"flex flex-row justify-center items-center"}>
                  <div className={"px-2"}>
                    <PrimaryButton icon={faFilter} onClick={dummy}>
                      <p>Filter</p>
                    </PrimaryButton>
                  </div>

                  <div className={"px-2"}>
                    <PrimaryButton icon={faSort} onClick={dummy}>
                      <p>Sort</p>
                    </PrimaryButton>
                  </div>

                  <div className={"flex-grow px-2 h-full"}>
                    <CustomInputField
                      icon={faMagnifyingGlass}
                      classNameDiv={"h-6"}
                    />
                  </div>

                  <div className={"px-2"}>
                    <PrimaryButton text={"Nieuw"} icon={faPlusCircle}>
                      <p>Nieuw</p>
                    </PrimaryButton>
                  </div>
                </div>
              </PrimaryCard>

              <PrimaryCard className={"my-2 flex-grow"}>
                <CustomTable
                  className={"w-full"}
                  columns={[
                    { name: "Datum" },
                    { name: "Ronde" },
                    { name: "Student" },
                    { name: "Gebouwen" },
                    { name: "Detail" },
                  ]}
                  data={schedule}
                />
              </PrimaryCard>
            </div>
          ) : (
            <div className={"flex items-center justify-center"}>
              <p className={"font-bold"}>NO SCHEDULES</p>
            </div>
          )}
        </SecondaryCard>
      </PrimaryCard>
    </div>
  );
}

AdminDashboardPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
