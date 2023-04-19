import Head from "next/head";
import React from "react";
import { useState, useEffect, useRef } from "react";
import BuildingService from "@/services/building.service";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import SelectionList from "@/components/selection/SelectionList";
import InputField from "@/components/input-fields/InputField";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import MapView from "@/components/MapView";

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

function BuildingFilter({ searchStringRef, className, regions, searchFunction }) {
  function handleChange(event) {
    setSearchString(event.target.value);
  }

  return (
    <div className={className}>
      <PrimaryCard >
        <div className={"flex-row"}>
          <PrimaryButton icon={faPlusCircle} text={"Filter"}></PrimaryButton>
          <PrimaryButton icon={faPlusCircle} text={"Sort"}></PrimaryButton>
          <div className="flex items-center">
            <div className="flex space-x-1">
              <InputField reference={searchStringRef} icon={faSearch} callback={() => searchFunction()}></InputField>
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

function NoBuildingSelected({ className }) {
  return (
    <div className={className}>
      <div className={"flex-col grow"}>
        <PrimaryCard title="Details">
          <h1 className={"text-light-h-1 font-bold text-lg p-3"}>Selecteer een gebouw</h1>
        </PrimaryCard>
      </div>
    </div >
  );
}

function BuildingView({ buildingDetail, className }) {
  return (
    <div className={className}>
      <PrimaryCard title="Details">
        <h1 className={"text-light-h-1 font-bold text-lg p-3"}>{buildingDetail["nickname"]}</h1>
        <p className={"p-3"}>{buildingDetail["description"]}</p>

        <div className={"basis-1/3 flex-row"}>

          <SecondaryCard title="Locatie">
            <p>{buildingDetail["address_line_1"]}</p>
            <p>{buildingDetail["address_line_2"]}</p>
            <MapView
              address={buildingDetail["address_line_1"] + " " + buildingDetail["address_line_2"]}
              mapWidth={300}
              mapHeight={400} />
          </SecondaryCard>

          <SecondaryCard title="raw building json">
            <p>{JSON.stringify(buildingDetail)}</p>
          </SecondaryCard>


        </div>
        <div className={"basis-2/3"}>
          <SecondaryCard title='Details'>
            pni
          </SecondaryCard>
        </div>
      </PrimaryCard>
    </div >

  );
}

export default function Buildings() {
  const [buildingList, setBuildingList] = useState([]);
  const [buildingDetail, setBuildingDetail] = useState("{}");
  const [buildingURL, setBuildingURL] = useState("");
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [regions] = useState([]);

  const loadBuildings = async () => {
    const buildings = await BuildingService.get();
    setBuildingList(buildings);
    setSearchResults(buildings);
  };

  const updateBuildingSelection = async (url) => {
    setBuildingURL(url)
    const building = await BuildingService.getEntryByUrl(url);
    setBuildingDetail(building);
    console.log(buildingDetail);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  function performSearch() {
    setSearchResults(buildingList.filter(
      building => {
        const search = searchString.current.value.toLowerCase()
        return (
          building["nickname"].toLowerCase().includes(search) ||
        building["description"].toLowerCase().includes(search) ||
        (building["address_line_1"] + " " + building["address_line_2"]).toLowerCase().includes(search)
        );        
      }
    ));
  }

  return (
    <>
      <Head>
        <title>Gebouwen</title>
      </Head>
      <div className={"flex-row"}>
        <BuildingFilter searchStringRef={searchString} searchFunction={performSearch} className={"p-3"} />
        <div className={"flex"}>
          {
            (buildingURL === "") ?
              <NoBuildingSelected className={"p-3 basis-2/3"} /> :
              <BuildingView buildingDetail={buildingDetail} className={"basis-2/3 p-3"} />
          }
          <BuildingSelector
            buildingList={searchResults}
            updateBuildingSelection={updateBuildingSelection}
            className={"p-3 grow"} />
        </div>
      </div>
    </>
  );
}
