import { useState } from "react";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import ScheduleService from "@/services/schedule.service";

export default function AdminDashboardPage() {
  // TODO: Implement this page
  const [response, setResponse] = useState("");
  const [id, setId] = useState("0");

  const allSchedule = async () => {
    const response = await ScheduleService.getAll();
    setResponse(JSON.stringify(response, null, 2));
  };

  const visitsFromSchedule = async () => {
    const response = await ScheduleService.getVisitsFromSchedule(id);
    console.log(response);
    setResponse(JSON.stringify(response, null, 2));
  };

  const filterSchedule = async () => {
    const response = await ScheduleService.filterSchedule(abc);
    console.log(response);
    setResponse(JSON.stringify(response, null, 2));
  };

  const dummy = () => console.log("Dummy");

  return (
    <>
      <PrimaryButton onClick={allSchedule}>
        <p>All Schedule</p>
      </PrimaryButton>
      <PrimaryButton onClick={visitsFromSchedule}>
        <p>Schedules with ID</p>
      </PrimaryButton>
      <div>
        <label htmlFor="quantity">Quantity (between 1 and 5):</label>
        <input type="number" onChange={(e) => setId(e.target.value)} />
      </div>
      <PrimaryCard title={"Response"} className={"my-4"}>
        <pre> {response} </pre>
      </PrimaryCard>

      <PrimaryCard className={"h-60 p-5"}>
        <div
          className={
            "flex flex-col max-h-full space-y-2"
          }
        >
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
          <PrimaryButton>
            <p>abc</p>
          </PrimaryButton>
        </div>
      </PrimaryCard>
    </>
  );
}
