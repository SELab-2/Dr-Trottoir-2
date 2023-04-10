import React from "react";
import { useState, useEffect } from "react";
import buildingService from "@/services/building.service";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import SelectionList from "@/components/selection/SelectionList";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function BuildingSelectionItem({ data, callback, setSelected, background }) {
  const url = data["url"];
  let nickname = "";
  let address = "";
  if (data !== undefined) {
    nickname = data["nickname"];
    address = data["address_line_1"];
    address += " ";
    address += data["address_line_2"];
  }

  function handleClick() {
    setSelected(url);
    callback(url);
  }

  return (
    <div
      data-testid="small-tour"
      className={"p-4 rounded-lg space-y-3 cursor-pointer"}
      style={{ backgroundColor: background }}
      onClick={handleClick}
    >
      <h1 className={"font-semibold"}>{nickname}</h1>
      <p>{address}</p>
    </div>
  );
}

export default function Buildings() {
  const [response, setResponse] = useState([]);
  const [buildingDetail, setBuildingDetail] = useState("{}");

  const loadBuildings = async () => {
    const buildings = await buildingService.getAll();
    setResponse(buildings["results"]);
  };

  const loadABuilding = async (url) => {
    const building = await buildingService.getOne(url);
    setBuildingDetail(building);
    console.log(buildingDetail);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  return (
    <>
      <PrimaryCard>
        <div class={"flex-row"}>
          <PrimaryButton icon={faPlusCircle} text={"Filter"}></PrimaryButton>
          <PrimaryButton icon={faPlusCircle} text={"Sort"}></PrimaryButton>
        </div>
      </PrimaryCard>

      <PrimaryCard title={"Gebouwen"}>
        <SelectionList
          elements={response}
          callback={(url) => {
            loadABuilding(url);
          }}
          Component={({ url, background, setSelected, callback, data }) => (
            <BuildingSelectionItem
              key={url}
              background={background}
              setSelected={setSelected}
              callback={callback}
              data={data}
            />
          )}
        />
      </PrimaryCard>

      <PrimaryCard title="debug selected building">
        <p>{JSON.stringify(buildingDetail)}</p>
      </PrimaryCard>

      <PrimaryCard title="Details">
        <p>{buildingDetail["description"]}</p>
      </PrimaryCard>
    </>
  );
}
