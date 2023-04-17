import Head from "next/head";
import React from "react";
import { useState, useEffect } from "react";
import buildingService from "@/services/building.service";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import SelectionList from "@/components/selection/SelectionList";
import InputField from "@/components/input-fields/InputField";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";

function BuildingSelectionItem({ data, callback, setSelected, background, }) {
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
      className={"p-4 rounded-lg space-y-3 cursor-pointer grow w-full"}
      style={{ backgroundColor: background }}
      onClick={handleClick}
    >
      <h1 className={"font-semibold"}>{nickname}</h1>
      <p>{address}</p>
    </div>
  );
}

function BuildingFilter({ setSearchString, className }) {
  function handleChange(event) {
    setSearchString(event.target.value);
  }

  return (
    <div className={className}>
      <PrimaryCard >
        <div className={"flex-row"}>
          {/* <PrimaryButton icon={faPlusCircle} text={"Filter"}></PrimaryButton>
        <PrimaryButton icon={faPlusCircle} text={"Sort"}></PrimaryButton> */}
          <div className="flex items-center">
            <div className="flex space-x-1">
              <InputField></InputField>
              <PrimaryButton icon={faSearch}>Zoeken</PrimaryButton>
            </div>
          </div>
        </div>

      </PrimaryCard>
    </div>

  );
}

function BuildingSelector({ buildingList, updateBuildingSelection, className }) {
  return (
    <div className={className}>
      <PrimaryCard title={"Gebouwen"}>
        <SelectionList
          className={"grow w-full"}
          elements={buildingList}
          callback={(url) => {
            updateBuildingSelection(url);
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
    </div>
  );
}

function BuildingView({ buildingDetail, className }) {
  return (
    <div className={className}>
      <div className={"flex-col"}>
        <PrimaryCard title="Details">
          <h1 className={"text-light-h-1 font-bold text-lg p-3"}>{buildingDetail["nickname"]}</h1>
          <p className={"p-3"}>{buildingDetail["description"]}</p>
          <div className={"basis-1/3 flex-row"}>
          </div>

          <div className={"flex-row"}>



            <PrimaryCard title="raw building json">
              <p>{JSON.stringify(buildingDetail)}</p>
            </PrimaryCard>


          </div>
        </PrimaryCard>

      </div>

    </div >

  );
}

export default function Buildings() {
  const [buildingList, setBuildingList] = useState([]);
  const [buildingDetail, setBuildingDetail] = useState("{}");
  const [buildingURL, setBuildingURL] = useState("");
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const loadBuildings = async () => {
    const buildings = await buildingService.getAll();
    setBuildingList(buildings["results"]);
  };

  const updateBuildingSelection = async (url) => {
    const building = await buildingService.getOne(url);
    setBuildingDetail(building);
    console.log(buildingDetail);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  return (
    <>
      <Head>
        <title>Gebouwen</title>
      </Head>
      <div className={"flex-row"}>
        <BuildingFilter setSearchString={setSearchString} className={"p-3"} />
        <div className={"flex"}>
          <BuildingView buildingDetail={buildingDetail} className={"basis-2/3 p-3"} />
          <BuildingSelector
            buildingList={buildingList}
            updateBuildingSelection={updateBuildingSelection}
            className={"p-3 grow"} />
        </div>
      </div>
    </>
  );
}
