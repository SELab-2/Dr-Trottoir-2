import Layout from "@/components/Layout";
import MapView from "@/components/MapView";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import InputField from "@/components/input-fields/InputField";
import SelectionList from "@/components/selection/SelectionList";
import BuildingService from "@/services/building.service";
import {
  faPlusCircle,
  faSearch,
  faLocationDot,
  faBriefcase,
  faEnvelope,
  faImage,
  faComment,
  faBuilding,
  faFilter,
  faSort,
  faFileText,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import SecondaryButton from "@/components/button/SecondaryButton";

export default function Buildings() {
  const [buildingList, setBuildingList] = useState([]);
  const [buildingDetail, setBuildingDetail] = useState({ owners: [] });
  const [buildingURL, setBuildingURL] = useState("");
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [visits, setVisits] = useState([]);

  const mapCard = useRef(null);

  const updateBuildingSelection = async (url) => {
    setBuildingURL(url);
    const building = await BuildingService.getEntryByUrl(url);
    setBuildingDetail(building);
    console.log(buildingDetail);
  };

  const loadBuildings = async () => {
    const buildings = await BuildingService.get();
    setBuildingList(buildings);
    setSearchResults(buildings);
    console.log(buildings[0]);
    await updateBuildingSelection(buildings[0].url);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  const performSearch = () => {
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
  };

  const BuildingSelectionItem = ({
    data,
    callback,
    setSelected,
    background,
  }) => {
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
  };

  return (
    <>
      <Head>
        <title>Dr. Trottoir: Gebouwen</title>
      </Head>
      <div className={"h-4/5"}>
        <PrimaryCard className={"m-2"}>
          <div className={"flex justify-between"}>
            <div className={"flex"}>
              <Dropdown
                icon={faFilter}
                text={"Filter"}
                className={"mr-2"}
                options={[]}
              >
                Filter
              </Dropdown>
              <Dropdown
                icon={faSort}
                text={"Sort"}
                className={"mr-2"}
                options={[]}
              >
                Sort
              </Dropdown>
              <InputField
                classNameDiv={"w-80"}
                reference={searchString}
                icon={faSearch}
                actionCallback={() => performSearch()}
              />
            </div>
            <PrimaryButton icon={faPlusCircle} text={"Sort"}>
              Nieuw
            </PrimaryButton>
          </div>
        </PrimaryCard>
        <div className={"flex"}>
          <PrimaryCard
            icon={faBuilding}
            title="Details"
            className={"m-2 basis-3/4"}
          >
            {buildingURL !== "" && (
              <div>
                <div>
                  <div className={"flex flex items-center"}>
                    <h1
                      className={"w-full text-light-h-1 font-bold text-xl my-5"}
                    >
                      {buildingDetail.nickname}
                    </h1>
                    <div className={"flex space-x-2"}>
                      <SecondaryButton icon={faPenToSquare} className={"h-fit"}>
                        Bewerk
                      </SecondaryButton>
                      <SecondaryButton icon={faTrash} className={"h-fit"}>
                        Verwijder
                      </SecondaryButton>
                    </div>
                  </div>
                </div>
                <div className={"flex"}>
                  <div className={"basis-1/3 mr-1"}>
                    <SecondaryCard
                      title={"Verantwoordelijke"}
                      icon={faBriefcase}
                      className={"my-2"}
                    >
                      {buildingDetail.owners.length === 0 ? (
                        <p>
                          Dit gebouw ontbreekt momenteel een verantwoordelijke.
                        </p>
                      ) : (
                        buildingDetail.owners.map((owner) => (
                          <div key={owner.email}>
                            <p className={"font-bold"}>
                              {owner["first_name"] + " " + owner.lastname}
                            </p>
                            <div className={"flex items-center"}>
                              <FontAwesomeIcon
                                icon={faEnvelope}
                                className={"p-1"}
                              />
                              <a
                                href={"mailto:" + owner.email}
                                className={"underline hover:no-underline"}
                              >
                                {owner.email}
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </SecondaryCard>
                    <div ref={mapCard}>
                      <SecondaryCard
                        title="Locatie"
                        icon={faLocationDot}
                        className={"my-2"}
                      >
                        <p>{buildingDetail.address_line_1}</p>
                        <p>{buildingDetail.address_line_2}</p>
                        <MapView
                          className={"pt-3  h-[420px]"}
                          address={
                            buildingDetail.address_line_1 +
                            " " +
                            buildingDetail.address_line_2
                          }
                          mapWidth={
                            mapCard.current
                              ? mapCard.current.offsetWidth - 45
                              : 0
                          }
                          mapHeight={400}
                        />
                      </SecondaryCard>
                    </div>
                  </div>
                  <div className={"ml-2 basis-2/3"}>
                    <SecondaryCard
                      title={"Beschrijving"}
                      icon={faFileText}
                      className={"my-2"}
                    >
                      <p>{buildingDetail["description"]}</p>
                    </SecondaryCard>
                    <SecondaryCard
                      title={"Foto's"}
                      icon={faImage}
                      className={"my-2"}
                    ></SecondaryCard>
                    <SecondaryCard
                      title={"Opmerkingen"}
                      icon={faComment}
                      className={"my-2"}
                    ></SecondaryCard>
                  </div>
                </div>
              </div>
            )}
          </PrimaryCard>
          <SelectionList
            title={"Gebouwen"}
            className={"m-2 basis-1/4 max-h-4/5"}
            elements={searchResults}
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
        </div>
      </div>
    </>
  );
}

Buildings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
