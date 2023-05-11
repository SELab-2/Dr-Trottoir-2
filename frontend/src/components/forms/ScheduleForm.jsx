import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import BasicForm from "@/components/forms/BasicForm";
import Loading from "@/components/Loading";
import ScheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import UserService from "@/services/user.service";
import { urlToPK } from "@/utils/urlToPK";
import { useEffect, useState } from "react";
import CustomDayPicker from "../input-fields/CustomDayPicker";
import { useRouter } from "next/router";
import SecondaryCard from "../custom-card/SecondaryCard";
import BuildingService from "@/services/building.service";
import TableWasteSchedule from "./forms-components/forms-input/TableWasteSchedule";

export default function ScheduleForm({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [selectedStudent, setSelectedStudent] = useState(-1);
  const [selectedTour, setSelectedTour] = useState(-1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allStudents, setAllStudents] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [tourBuildings, setTourBuildings] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = {
      student: selectedStudent,
      tour: selectedTour,
      date: selectedDate.toISOString().substr(0, 10),
    };
    alert(
      `You have submitted the form. 
      The data you want to submit is: ${JSON.stringify(data)}`
    );
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
      setAllStudents(await UserService.get());
      setAllTours(await TourService.get());
      if (id) {
        const schedule = await ScheduleService.getById(id);
        setSelectedStudent(schedule.student);
        setSelectedTour(schedule.tour);
        setSelectedDate(new Date(schedule.date));
      }
    }

    fetchData()
      .then(() => setLoading(false))
      .catch();
  }, [id]);

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  const handleTourSelect = async (tour) => {
    setSelectedTour(tour);
    let buildings_in_tour = await TourService.getBuildingsFromTour(urlToPK(tour));
    // Fix the format of the data, change it to [{building: <info building>, order_index: <order>}...]
    const fixed_format = await Promise.all(
      buildings_in_tour.map(async (building_in_tour) => ({
        building: await BuildingService.getEntryByUrl(
          building_in_tour.building
        ),
        order_index: building_in_tour.order_index,
      }))
    );
    const sorted = fixed_format.sort(
      (a, b) => a.order_index - b.order_index
    );

    setTourBuildings(sorted);
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
        date={selectedDate}
        className={"w-full"}
        onChange={(date) => setSelectedDate(date)}
      />

      <SelectForm
        id={"student"}
        label={"Student"}
        onChange={(student) => setSelectedStudent(student.target.value)}
        className={"flex-grow"}
        value={selectedStudent}
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
        onChange={(tour) => handleTourSelect(tour.target.value)}
        className={"flex-grow"}
        value={selectedTour}
      >
        {allTours.map((tour, index) => {
          return (
            <option key={tour.url} value={tour.url}>
              {tour.name}
            </option>
          );
        })}
      </SelectForm>

      {tourBuildings.length != 0 ? (
        <SecondaryCard className={"!pl-0"}>
          <TableWasteSchedule buildings={tourBuildings}></TableWasteSchedule>
        </SecondaryCard>) :
        (<p>Selecteer een ronde</p>)
      }
      

      
    </BasicForm>
  );
}
