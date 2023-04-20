import Layout from "@/components/Layout";
import MapView from "@/components/MapView";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import InputField from "@/components/input-fields/InputField";
import SelectionList from "@/components/selection/SelectionList";
import BuildingService from "@/services/building.service";
import userService from "@/services/user.service";
import visitService from "@/services/visit.service";
import { faPinterest } from "@fortawesome/free-brands-svg-icons";
import {
  faPlusCircle,
  faSearch,
  faLocation,
  faLocationPin,
  faLocationPinLock,
  faLocationDot,
  faBriefcase,
  faPhone,
  faEnvelope,
  faImage,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

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
      className={"p-2 rounded-lg space-y-1 cursor-pointer"}
      style={{ backgroundColor: background }}
      onClick={handleClick}
    >
      <h1 className={"font-semibold"}>{nickname}</h1>
      <p>{address}</p>
    </div>
  );
}

function BuildingFilter({ searchStringRef, className, searchFunction }) {
  return (
    <div className={className}>
      <PrimaryCard>
        <div className={""}>
          {/* <PrimaryButton icon={faPlusCircle} text={"Filter"}></PrimaryButton>
          <PrimaryButton icon={faPlusCircle} text={"Sort"}></PrimaryButton> */}
          <InputField
            classNameDiv={"w-80"}
            reference={searchStringRef}
            icon={faSearch}
            actionCallback={() => searchFunction()}
          />
        </div>
      </PrimaryCard>
    </div>
  );
}

function BuildingSelector({
  buildingList,
  updateBuildingSelection,
  className,
}) {
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
          <h1 className={"text-light-h-1 font-bold text-lg m-3"}>
            Selecteer een gebouw
          </h1>
        </PrimaryCard>
      </div>
    </div>
  );
}

function BuildingView({ buildingDetail, className }) {
  const mapCard = useRef(null);

  return (
    <div className={className}>
      <PrimaryCard title="Details">
        <h1 className={"text-light-h-1 font-bold text-lg m-3"}>
          {buildingDetail["nickname"]}
        </h1>
        <p className={"m-2"}>{buildingDetail["description"]}</p>

        <div className={"flex flex-row grid grid-cols-3"}>
          <div>
            {buildingDetail["owners"].map((owner) => (
              <SecondaryCard
                key={owner["email"]}
                title={"Verantwoordelijke"}
                icon={faBriefcase}
                className={"m-2"}
              >
                <p className={"font-bold"}>
                  {owner["first_name"] + " " + owner["last_name"]}
                </p>
                <div className={"flex items-center"}>
                  <FontAwesomeIcon icon={faEnvelope} className={"p-1"} />
                  <a
                    href={"mailto:" + owner["email"]}
                    className={"underline hover:no-underline"}
                  >
                    {owner["email"]}
                  </a>
                </div>
              </SecondaryCard>
            ))}

            <div ref={mapCard}>
              <SecondaryCard
                title="Locatie"
                icon={faLocationDot}
                className={"m-2"}
              >
                <p>{buildingDetail["address_line_1"]}</p>
                <p>{buildingDetail["address_line_2"]}</p>
                <MapView
                  className={"pt-3"}
                  address={
                    buildingDetail["address_line_1"] +
                    " " +
                    buildingDetail["address_line_2"]
                  }
                  mapWidth={
                    mapCard.current ? mapCard.current.offsetWidth - 45 : 0
                  }
                  mapHeight={400}
                />
              </SecondaryCard>
            </div>
          </div>
          <div className={"col-span-2"}>
            <SecondaryCard
              title={"Foto's"}
              icon={faImage}
              className={"m-2"}
            ></SecondaryCard>
            <SecondaryCard
              title={"Opmerkingen"}
              icon={faComment}
              className={"m-2"}
            ></SecondaryCard>
          </div>
        </div>
      </PrimaryCard>
    </div>
  );
}

export default function Buildings() {
  const [buildingList, setBuildingList] = useState([]);
  const [buildingDetail, setBuildingDetail] = useState({ owners: [] });
  const [buildingURL, setBuildingURL] = useState("");
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [visits, setVisits] = useState([]);

  const loadBuildings = async () => {
    const buildings = await BuildingService.get();
    setBuildingList(buildings);
    setSearchResults(buildings);
  };

  const updateBuildingSelection = async (url) => {
    setBuildingURL(url);
    const building = await BuildingService.getEntryByUrl(url);
    setBuildingDetail(building);
    console.log(buildingDetail);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  function performSearch() {
    setSearchResults(
      buildingList.filter((building) => {
        const search = searchString.current.value.toLowerCase();
        return (
          building["nickname"].toLowerCase().includes(search) ||
          building["description"].toLowerCase().includes(search) ||
          (building["address_line_1"] + " " + building["address_line_2"])
            .toLowerCase()
            .includes(search)
        );
      })
    );
  }

  return (
    <>
      <Head>
        <title>Gebouwen</title>
      </Head>
      <div className={"flex-row"}>
        <BuildingFilter
          searchStringRef={searchString}
          searchFunction={performSearch}
          className={"m-2"}
        />
        <div className={"flex"}>
          {buildingURL === "" ? (
            <NoBuildingSelected className={"m-2 basis-3/4"} />
          ) : (
            <BuildingView
              buildingDetail={buildingDetail}
              className={"basis-3/4 m-2"}
            />
          )}
          <BuildingSelector
            buildingList={searchResults}
            updateBuildingSelection={updateBuildingSelection}
            className={"m-2 grow"}
          />
        </div>
      </div>
    </>
  );
}

Buildings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
