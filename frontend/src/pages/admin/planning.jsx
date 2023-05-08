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
  faComment,
  faBicycle,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";
import { useEffect, useRef, useState } from "react";
import ScheduleService from "@/services/schedule.service";
import CustomTable from "@/components/table/Table";
import { getMonday, getSunday } from "@/utils/helpers";
import TourService from "@/services/tour.service";
import UserService from "@/services/user.service";
import CustomProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { urlToPK } from "@/utils/urlToPK";
import Layout from "@/components/Layout";
import VisitService from "@/services/visit.service";
import ColoredTag from "@/components/Tag";
import PieChart from "@/components/PieChart";
import Dropdown from "@/components/Dropdown";

export default function AdminDashboardPage() {
  const [schedule, setSchedule] = useState([]);
  const [startDate, setStartDate] = useState(getMonday(new Date()));
  const [endDate, setEndDate] = useState(getSunday(new Date()));
  const [amountOfComments, setAmountOfComments] = useState(0);
  const [amountOfCompleted, setAmountOfCompleted] = useState(0);
  const [amountOfStarted, setAmountOfStarted] = useState(0);
  const [entries, setEntries] = useState([]);
  const searchString = useRef("");
  const [sortString, setSortString] = useState("");
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      const newEndDate = endDate.setHours(23, 59, 59, 999);
      let schedules = await ScheduleService.get({
        startDate: startDate,
        endDate: newEndDate,
      });
      let totalComments = 0;
      let completed = 0;
      let started = 0;

      // construct the data for the table
      const scheduleEntries = await Promise.all(
        schedules.map(async (schedule) => {
          const tour = await TourService.getEntryByUrl(schedule.tour);
          const student = await UserService.getEntryByUrl(schedule.student);
          const visits = await ScheduleService.getVisitsFromSchedule(
            urlToPK(schedule.url)
          );
          let comments = 0;
          let departures = 0;
          await Promise.all(
            visits.map(async (visit) => {
              const visitComments = await VisitService.getCommentsFromVisit(
                urlToPK(visit.url)
              );
              comments += visitComments.length;
              const visitPhotos = await VisitService.getPhotosByVisit(
                urlToPK(visit.url)
              );
              // visit complete if there is a departure photo
              if (visitPhotos.some((photo) => photo.state === 2)) {
                departures += 1;
              }
            })
          );
          const scheduleComments =
            await ScheduleService.getCommentsFromSchedule(
              urlToPK(schedule.url)
            );
          comments += scheduleComments.length;
          totalComments += comments;
          const buildings = await TourService.getBuildingsFromTour(
            urlToPK(tour.url)
          );

          if (departures > 0) {
            if (departures === buildings.length) {
              completed += 1;
            } else {
              started += 1;
            }
          }
          return {
            url: schedule.url,
            date: schedule.date,
            tour: tour.name,
            student: student.first_name,
            visits: departures,
            buildings: buildings.length,
            comments: comments,
          };
        })
      );
      setAmountOfComments(totalComments);
      setAmountOfCompleted(completed);
      setAmountOfStarted(started);
      performSearch(scheduleEntries, sortString, filterString);
      setEntries(scheduleEntries);
    }
    fetchData().catch();
  }, [endDate, startDate]);

  // Renders the table
  const performSearch = (scheduleEntries, sortField, filtering) => {
    // Filters on input field
    if (searchString.current !== "") {
      const search = searchString.current.value.toLowerCase();
      scheduleEntries = scheduleEntries.filter(
        (entry) =>
          entry.tour.toLowerCase().includes(search) ||
          entry.student.toLowerCase().includes(search)
      );
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
    // Renders the table rows
    setSchedule(
      scheduleEntries.map((entry) => [
        entry.date,
        entry.tour,
        entry.student,
        <div key={entry.url} className={"flex flex-row space-x-4"}>
          <div className={"flex-grow"}>
            <CustomProgressBar
              fraction={entry.visits / entry.buildings}
              is_wheel={false}
            />
          </div>
          <p>
            {entry.visits} / {entry.buildings}
          </p>
        </div>,
        entry.comments > 0 && (
          <ColoredTag className={"text-primary-1 bg-primary-2"}>
            {entry.comments}
          </ColoredTag>
        ),
        <Link
          key={entry.url}
          href={`/admin/planningen/${urlToPK(entry.url)}`}
          className={"bg-primary-2 border-2 border-light-h-2 rounded-lg p-1"}
        >
          Details
        </Link>,
      ])
    );
  };

  const performSort = (sort) => {
    const newSort = sort.length > 0 ? sort[0] : "";
    setSortString(newSort);
    performSearch(entries, newSort, filterString);
  };

  const performFilter = (filtering) => {
    const newFilter = filtering.length > 0 ? filtering[0] : "";
    setFilterString(newFilter);
    performSearch(entries, sortString, newFilter);
  };

  const filterSchedules = (schedules, filtering) => {
    if (filtering === "Nog niet begonnen") {
      return schedules.filter((schedule) => schedule.visits === 0);
    }
    if (filtering === "Onderweg") {
      return schedules.filter((schedule) => {
        const completeness = schedule.visits / schedule.buildings;
        return completeness > 0 && completeness < 1;
      });
    }
    if (filtering === "Compleet") {
      return schedules.filter(
        (schedule) => schedule.visits / schedule.buildings === 1
      );
    }
    return schedules;
  };

  const stringToField = {
    Student: "student",
    Ronde: "tour",
    Datum: "date",
  };

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
          className="!light-bg-1"
        />
      </div>

      <PrimaryCard>
        <div id={"statistics"} className={"flex flex-row grid grid-cols-2"}>
          <div className="flex flex-col">
            <SecondaryCard
              title={"Aantal Rondes"}
              className={"m-2 justify-center items-center flex-1"}
              icon={faBicycle}
            >
              {entries.length === 1 ? (
                <p className={"font-bold"}>{entries.length} ronde</p>
              ) : (
                <p className={"font-bold"}>{entries.length} rondes</p>
              )}
            </SecondaryCard>
            <SecondaryCard
              icon={faComment}
              title={"Aantal opmerkingen"}
              className={"m-2 justify-center items-center flex-1"}
            >
              {amountOfComments === 1 ? (
                <p className={"font-bold"}>{amountOfComments} opmerking</p>
              ) : (
                <p className={"font-bold"}>{amountOfComments} opmerkingen</p>
              )}
            </SecondaryCard>
          </div>
          <SecondaryCard
            title={"Overzicht"}
            icon={faChartPie}
            className={"m-2"}
          >
            {entries.length > 0 && (
              <div className={"flex flex-col lg:flex-row items-center"}>
                <PieChart
                  fractions={[
                    (entries.length - amountOfCompleted - amountOfStarted) /
                      entries.length,
                    amountOfStarted / entries.length,
                    amountOfCompleted / entries.length,
                  ]}
                  circleWidth={200}
                  radius={70}
                />
                <div className="font-bold">
                  <p className={"text-bad-1"}>
                    {entries.length - amountOfCompleted - amountOfStarted}
                    {" Nog niet begonnen"}
                  </p>
                  <p className={"text-meh-1"}>{amountOfStarted} Onderweg</p>
                  <p className={"text-done-1"}>{amountOfCompleted} Compleet</p>
                </div>
              </div>
            )}
          </SecondaryCard>
        </div>

        <SecondaryCard icon={faBicycle} title={"Rondes"} className={"m-2"}>
          {entries.length ? (
            <div className={"flex flex-col"}>
              <PrimaryCard>
                <div className={"flex flex-row justify-center items-center"}>
                  <div className={"px-2"}>
                    <Dropdown
                      icon={faFilter}
                      options={["Nog niet begonnen", "Onderweg", "Compleet"]}
                      onClick={performFilter}
                    >
                      <p>Filter</p>
                    </Dropdown>
                  </div>

                  <div className={"px-2"}>
                    <Dropdown
                      icon={faSort}
                      options={["Datum", "Ronde", "Student"]}
                      onClick={performSort}
                    >
                      <p>Sort</p>
                    </Dropdown>
                  </div>

                  <div className={"flex-grow px-2 h-full"}>
                    <CustomInputField
                      icon={faMagnifyingGlass}
                      reference={searchString}
                      classNameDiv={"h-8"}
                      actionCallback={() =>
                        performSearch(entries, sortString, filterString)
                      }
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
                    { name: "Opmerkingen" },
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
