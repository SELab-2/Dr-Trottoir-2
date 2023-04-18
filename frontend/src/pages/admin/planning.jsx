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
import ProgressBar from "react-customizable-progressbar";
import CustomProgressBar from "@/components/ProgressBar";

// TODO: change this to the implemention from Bert his PR
export const urlToPK = (url) => {
  const regex = /\/(\d+)\/$/;
  const match = url.match(regex);
  if (match !== null) {
    return match[1];
  }
};

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
            <CustomProgressBar
              key={schedule.url}
              fraction={visits.length / buildings.buildings.length}
              is_wheel={false}
            />,
          ];
        })
      );
      setSchedule(columns);
    }
    fetchData().catch();
  }, [endDate, startDate]);

  const dummy = () => console.log("Dummy");

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"flex m-2"}>
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
        <div id={"statistics"} className={"flex flex-row"}>
          <SecondaryCard
            title={"Aantal Rondes"}
            className={"flex-grow m-2 justify-center items-center"}
          >
            {schedule.length === 1 ? (
              <p className={"font-bold"}>{schedule.length} Ronde</p>
            ) : (
              <p className={"font-bold"}>{schedule.length} Rondes</p>
            )}
          </SecondaryCard>
          <SecondaryCard
            title={"Aantal opmerkingen"}
            className={"flex-grow m-2"}
          >
            <p>aantal opmerkingen</p>
          </SecondaryCard>
          <SecondaryCard title={"Overview"} className={"flex-grow m-2"}>
            <p>Overview</p>
          </SecondaryCard>
        </div>

        <div id={"rondes"}>
          <SecondaryCard title={"Rondes"} className={"m-2"}>
            <PrimaryCard className={"my-2"}>
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

            <PrimaryCard className={"my-2"}>
              <CustomTable
                className={"w-full"}
                columns={[
                  { name: "Datum" },
                  { name: "Ronde" },
                  { name: "Student" },
                  { name: "Gebouwen" },
                ]}
                data={schedule}
              />
            </PrimaryCard>
          </SecondaryCard>
        </div>
      </PrimaryCard>
    </>
  );
}
