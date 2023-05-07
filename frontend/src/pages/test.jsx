import { useState } from "react";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import TourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";

export default function TestPage() {
  // TODO: Implement this page
  const [response, setResponse] = useState("");
  const [id, setId] = useState("0");
  const [url, setUrl] = useState("0");

  // GETS
  const allTour = async () => {
    const response = await TourService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const tourById = async () => {
    const response = await TourService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const tourByUrl = async () => {
    const response = await TourService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const allBuildingInTour = async () => {
    const response = await BuildingInTourService.get();
    setResponse(JSON.stringify(response, null, 2));
  };

  const buildingInTourById = async () => {
    const response = await BuildingInTourService.getById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const buildingInTourByUrl = async () => {
    const response = await BuildingInTourService.getEntryByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  // POST
  const postTour = async () => {
    const response = await TourService.post({});
    setResponse(JSON.stringify(response, null, 2));
  };

  const postBuildingInTour = async () => {
    const response = await BuildingInTourService.post({});
    setResponse(JSON.stringify(response, null, 2));
  };

  // PATCH
  const patchIdTour = async () => {
    const response = await TourService.patchById(id, {});
    setResponse(JSON.stringify(response, null, 2));
  };

  const patchURLTour = async () => {
    const response = await TourService.patchByUrl(url, {});
    setResponse(JSON.stringify(response, null, 2));
  };

  const patchIdBuildingInTour = async () => {
    const response = await BuildingInTourService.patchById(id, {});
    setResponse(JSON.stringify(response, null, 2));
  };

  const patchURLBuildingInTour = async () => {
    const response = await BuildingInTourService.patchByUrl(url, {});
    setResponse(JSON.stringify(response, null, 2));
  };

  //DELETE
  const deleteIdTour = async () => {
    const response = await TourService.deleteById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const deleteURLTour = async () => {
    const response = await TourService.deleteByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  const deleteIdBuildingInTour = async () => {
    const response = await BuildingInTourService.deleteById(id);
    setResponse(JSON.stringify(response, null, 2));
  };

  const deleteURLBuildingInTour = async () => {
    const response = await BuildingInTourService.deleteByUrl(url);
    setResponse(JSON.stringify(response, null, 2));
  };

  return (
    <>
      <div className={"w-1/2"}>
        <div>
          <p>TOUR</p>
        </div>
        <div>
          <PrimaryButton onClick={allTour} className={"w-1/3"}>
            <p>All tours</p>
          </PrimaryButton>
          <PrimaryButton onClick={tourById} className={"w-1/3"}>
            <p>tour by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={tourByUrl} className={"w-1/3"}>
            <p>tour by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={postTour} className={"w-1/3"}>
            <p>POST TOUR</p>
          </PrimaryButton>
          <PrimaryButton onClick={patchIdTour} className={"w-1/3"}>
            <p>PATCH ID TOUR</p>
          </PrimaryButton>
          <PrimaryButton onClick={patchURLTour} className={"w-1/3"}>
            <p>PATCH URL TOUR</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={deleteIdTour} className={"w-1/3"}>
            <p>DELETE ID TOUR</p>
          </PrimaryButton>
          <PrimaryButton onClick={deleteURLTour} className={"w-1/3"}>
            <p>DELETE URL TOUR</p>
          </PrimaryButton>
        </div>

        <div>
          <p>BUILDING IN TOUR</p>
        </div>
        <div>
          <PrimaryButton onClick={allBuildingInTour} className={"w-1/3"}>
            <p>All Building in Tour</p>
          </PrimaryButton>
          <PrimaryButton onClick={buildingInTourById} className={"w-1/3"}>
            <p>Building in Tour by ID</p>
          </PrimaryButton>
          <PrimaryButton onClick={buildingInTourByUrl} className={"w-1/3"}>
            <p>Building in Tour by URL</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={postBuildingInTour} className={"w-1/3"}>
            <p>POST Building in Tour</p>
          </PrimaryButton>
          <PrimaryButton onClick={patchIdTour} className={"w-1/3"}>
            <p>PATCH ID Building in Tour</p>
          </PrimaryButton>
          <PrimaryButton onClick={patchURLTour} className={"w-1/3"}>
            <p>PATCH URL TOBuilding in TourUR</p>
          </PrimaryButton>
        </div>

        <div>
          <PrimaryButton onClick={deleteIdTour} className={"w-1/3"}>
            <p>DELETE ID Building in Tour</p>
          </PrimaryButton>
          <PrimaryButton onClick={deleteURLTour} className={"w-1/3"}>
            <p>DELETE URL Building in Tour</p>
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
