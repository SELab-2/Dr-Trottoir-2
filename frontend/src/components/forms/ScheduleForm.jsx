import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import BasicForm from "@/components/forms/BasicForm";
import Loading from "@/components/Loading";
import scheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import userService from "@/services/user.service";
import { useEffect, useState } from "react";
import CustomDayPicker from "../input-fields/CustomDayPicker";
import { useRouter } from "next/router";
import TableWasteSchedule from "./forms-components/forms-input/TableWasteSchedule";
import moment from "moment";
import { urlToPK } from "@/utils/urlToPK";
import BuildingService from "@/services/building.service";
import WasteService from "@/services/waste.service";
import SecondaryCard from "../custom-card/SecondaryCard";

export default function ScheduleForm({ id }) {
  const [loading, setLoading] = useState(true);
  const [loadSchedule, setLoadSchedule] = useState(false);
  const router = useRouter();

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTour, setSelectedTour] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment());
  const [allStudents, setAllStudents] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [waste, setWaste] = useState(null);
  const [tourBuildings, setTourBuildings] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = {
      student: selectedStudent,
      tour: selectedTour,
      date: moment(selectedDate).format("YYYY-MM-DD"),
    };
    try {
      if (id) {
        await scheduleService.patchById(id, data);
      } else {
        await scheduleService.post(data);
      }

      //TODO: change to better reload
      router.reload();
    } catch (e) {
      alert(e);
    }
  };

  const onDelete = async () => {
    try {
      await scheduleService.deleteById(id);
      await router.push(`/admin/data_toevoegen/planningen`);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setAllStudents(await userService.get());
      setAllTours(await TourService.get());
      if (id) {
        const schedule = await scheduleService.getById(id);
        setSelectedStudent(schedule.student);
        setSelectedTour(schedule.tour);
        setSelectedDate(moment(schedule.date));
        fetchTourBuildings(schedule.tour, moment(schedule.date));
      }
    }

    fetchData()
      .then(() => setLoading(false))
      .catch();
  }, [id]);

  const fetchTourBuildings = async (tour, date) => {
    setLoadSchedule(true);
    setWaste(null);
    setSelectedTour(tour);
    const buildingsInTour = await TourService.getBuildingsFromTour(
      urlToPK(tour)
    );
    const fixedFormat = await Promise.all(
      buildingsInTour.map(async (buildingInTour) => ({
        building: await BuildingService.getEntryByUrl(buildingInTour.building),
        order_index: buildingInTour.order_index,
      }))
    );
    const sorted = fixedFormat.sort((a, b) => a.order_index - b.order_index);
    fetchWaste(
      moment(date).isoWeekday(1).toDate(),
      moment(date).isoWeekday(7).toDate(),
      sorted
    );
    setTourBuildings(sorted);
    setLoadSchedule(false);
  };

  const fetchWaste = async (startDate, endDate, buildings) => {
    const wasteSchedule = {};
    const wasteEntries = await WasteService.get({
      startDate: startDate,
      endDate: endDate,
    });
    buildings.map((building) => {
      const buildingUrl = building.building.url;
      wasteSchedule[building.building.url] = wasteEntries.filter(
        (w) => w.building === buildingUrl
      );
    });
    setWaste(wasteSchedule);
  };

  const changeDate = (date) => {
    const newDate = moment(date);
    // If newdate is in a different week -> fetch new waste
    if (moment(date).isoWeek() !== moment(selectedDate).isoWeek()) {
      setLoadSchedule(true);
      fetchTourBuildings(selectedTour, newDate);
      setLoadSchedule(false);
    }
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  return (
    <BasicForm
      loading={loading}
      onSubmit={onSubmit}
      onDelete={onDelete}
      model={"planning"}
      editMode={id !== undefined}
    >
      <label className={"font-bold"}> {"Datum"} </label>
      <CustomDayPicker
        date={selectedDate.toDate()}
        className={"w-full"}
        onChange={(date) => changeDate(date)}
      />

      <SelectForm
        id={"student"}
        label={"Student"}
        onChange={(student) => setSelectedStudent(student.target.value)}
        className={"flex-grow"}
        value={selectedStudent}
        required
      >
        {allStudents.map((student, index) => {
          return (
            <option key={student.url} value={student.url}>
              {student.first_name + " " + student.last_name}
            </option>
          );
        })}
      </SelectForm>

      <SelectForm
        id={"tour"}
        label={"Ronde"}
        onChange={(tour) => fetchTourBuildings(tour.target.value, selectedDate)}
        className={"flex-grow"}
        value={selectedTour}
        required
      >
        {allTours.map((tour, index) => {
          return (
            <option key={tour.url} value={tour.url}>
              {tour.name}
            </option>
          );
        })}
      </SelectForm>

      <label className={"font-bold"}> {"Kalender"} </label>
      <SecondaryCard>
        {loadSchedule ? (
          <SecondaryCard>
            <div className={"flex justify-center items-center h-fit w-full"}>
              <Loading className={"w-10 h-10"} />
            </div>
          </SecondaryCard>
        ) : (
          tourBuildings.length > 0 &&
          waste !== null && (
            <TableWasteSchedule
              buildings={tourBuildings}
              wasteSchedule={waste}
              startDate={moment(selectedDate).startOf("isoWeek").toDate()}
              selectDayIndex={moment(selectedDate).isoWeekday() - 1}
              editable={false}
            />
          )
        )}
      </SecondaryCard>
    </BasicForm>
  );
}
