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

export default function AdminDashboardPage() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    ScheduleService.getSchedules().then((schedule) => {
      setSchedule(schedule.map((el) => [el.date, el.tour, el.student, 2]));
    });
  }, []);

  const dummy = () => console.log("Dummy");

  return (
    <>
      <Head>
        <title>Rondes</title>
      </Head>
      <div className={"flex m-2"}>
        <CustomWeekPicker />
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
