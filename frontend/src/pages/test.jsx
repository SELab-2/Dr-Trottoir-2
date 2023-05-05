import { useState } from "react";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import ScheduleService from "@/services/schedule.service";
import BuildingService from "@/services/building.service";
import PhotoService from "@/services/photo.service";
import TourService from "@/services/tour.service";
import UserService from "@/services/user.service";
import VisitService from "@/services/visit.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import RegioService from "@/services/region.service";
import RegionService from "@/services/region.service";

export default function TestPage() {
  // TODO: Implement this page
  const [response, setResponse] = useState("");
  const [id, setId] = useState("0");
  const [url, setUrl] = useState("0");

  // ALL FUNCTIONS
  const allBuildings = async () => {
    const response = await BuildingService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allBuildingInTour = async () => {
    const response = await BuildingInTourService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allPhoto = async () => {
    const response = await PhotoService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allSchedule = async () => {
    const response = await ScheduleService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allTour = async () => {
    const response = await TourService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allRegion = async () => {
    const response = await RegionService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allUser = async () => {
    const response = await UserService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allVisit = async () => {
    const response = await VisitService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  // ID FUNCTIONS
  const buildingById = async () => {
    const response = await BuildingService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const buildingInTourById = async () => {
    const response = await BuildingInTourService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const photoById = async () => {
    const response = await PhotoService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const scheduleById = async () => {
    const response = await ScheduleService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const tourById = async () => {
    const response = await TourService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const regionById = async () => {
    const response = await RegionService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const userById = async () => {
    const response = await UserService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const visitById = async () => {
    const response = await VisitService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  //URL FUNCTIONS
  const buildingByUrl = async () => {
    const response = await BuildingService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const buildingInTourByUrl = async () => {
    const response = await BuildingInTourService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const photoByUrl = async () => {
    const response = await PhotoService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const scheduleByUrl = async () => {
    const response = await ScheduleService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const tourByUrl = async () => {
    const response = await TourService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const regionByUrl = async () => {
    const response = await RegionService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const userByUrl = async () => {
    const response = await UserService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const visitByUrl = async () => {
    const response = await VisitService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  return (
    <>
      <div className={"w-1/2"}>
        <div>
          <PrimaryButton onClick={allBuildings} className={"w-1/3"}>
            <p>All buildings</p>
          </PrimaryButton>
          <PrimaryButton onClick={buildingById} className={"w-1/3"}>
            <p>Building by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={buildingByUrl} className={"w-1/3"}>
            <p>Building by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allBuildingInTour} className={"w-1/3"}>
            <p>All buildingInTour</p>
          </PrimaryButton>
          <PrimaryButton onClick={buildingInTourById} className={"w-1/3"}>
            <p>buildingInTour by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={buildingInTourByUrl} className={"w-1/3"}>
            <p>buildingInTour by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allPhoto} className={"w-1/3"}>
            <p>All photo</p>
          </PrimaryButton>
          <PrimaryButton onClick={photoById} className={"w-1/3"}>
            <p>photo by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={photoByUrl} className={"w-1/3"}>
            <p>photo by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allSchedule} className={"w-1/3"}>
            <p>All Schedule</p>
          </PrimaryButton>
          <PrimaryButton onClick={scheduleById} className={"w-1/3"}>
            <p>Schedule by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={scheduleByUrl} className={"w-1/3"}>
            <p>Schedule by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allTour} className={"w-1/3"}>
            <p>All tour</p>
          </PrimaryButton>
          <PrimaryButton onClick={tourById} className={"w-1/3"}>
            <p>tour by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={tourByUrl} className={"w-1/3"}>
            <p>tour by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allRegion} className={"w-1/3"}>
            <p>All regions</p>
          </PrimaryButton>
          <PrimaryButton onClick={regionById} className={"w-1/3"}>
            <p>region by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={regionByUrl} className={"w-1/3"}>
            <p>region by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allUser} className={"w-1/3"}>
            <p>All user</p>
          </PrimaryButton>
          <PrimaryButton onClick={userById} className={"w-1/3"}>
            <p>user by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={userByUrl} className={"w-1/3"}>
            <p>user by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={allVisit} className={"w-1/3"}>
            <p>All visit</p>
          </PrimaryButton>
          <PrimaryButton onClick={visitById} className={"w-1/3"}>
            <p>visit by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={visitByUrl} className={"w-1/3"}>
            <p>visit by URL</p>
          </PrimaryButton>
        </div>
      </div>

      <div>
        <label>ID:</label>
        <input type="number" onChange={(e) => setId(e.target.value)} />
      </div>
      <div>
        <label>URL:</label>
        <input type="text" onChange={(e) => setUrl(e.target.value)} />
      </div>
      <PrimaryCard title={"Response"} className={"my-4"}>
        <pre> {response} </pre>
      </PrimaryCard>
    </>
  );
}
