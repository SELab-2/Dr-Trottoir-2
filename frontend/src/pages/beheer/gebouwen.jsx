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
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Dropdown from "@/components/Dropdown";
import SecondaryButton from "@/components/button/SecondaryButton";
import { useRouter } from "next/router";
import { urlToPK } from "@/utils/urlToPK";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";
import { getMonday, getSunday } from "@/utils/helpers";
import buildingService from "@/services/building.service";
import Image from "next/image";
import regionService from "@/services/region.service";

export default function Buildings() {
  const [buildingList, setBuildingList] = useState([]);
  const [buildingDetail, setBuildingDetail] = useState({ owners: [] });
  const [buildingURL, setBuildingURL] = useState("");
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectionStartDate, setSelectionStartDate] = useState(
    getMonday(new Date())
  );
  const [selectionEndDate, setSelectionEndDate] = useState(
    getSunday(new Date())
  );
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sortingSetting, setSortingSetting] = useState("");

  const mapCard = useRef(null);
  const router = useRouter();

  const updateBuildingSelection = async (url) => {
    setBuildingURL(url);
    loadPhotos(url);
    loadComments(url);
    const building = await BuildingService.getEntryByUrl(url);
    setBuildingDetail(building);
  };

  const loadBuildings = async () => {
    const buildings = await BuildingService.get();
    setBuildingList(buildings);
    setSearchResults(buildings);
    await updateBuildingSelection(buildings[0]?.url);
  };

  const loadRegions = async () => {
    const regions = await regionService.get();
    setRegionList(regions);
  };

  const formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const loadPhotos = async (
    url,
    startDate = selectionStartDate,
    endDate = selectionEndDate
  ) => {
    const photos = await buildingService.getPhotosByUrl(
      url,
      formatDate(startDate),
      formatDate(endDate)
    );
    setPhotos(photos);
  };

  const loadComments = async (
    url,
    startDate = selectionStartDate,
    endDate = selectionEndDate
  ) => {
    const comments = await buildingService.getCommentsByUrl(
      url,
      formatDate(startDate),
      formatDate(endDate)
    );
    setComments(comments);
  };

  useEffect(() => {
    loadBuildings();
    loadRegions();
  }, []);

  const filter = (params = {}) => {
    const regionFilter =
      "regions" in params ? params["regions"] : selectedRegions;
    const searchFilter = "search" in params ? params["search"] : searchString;
    const sortSetting = "sort" in params ? params["sort"] : sortingSetting;

    let filterResults = buildingList;

    if (regionFilter.length) {
      filterResults = filterResults.filter((building) =>
        JSON.stringify(regionFilter).includes(
          JSON.stringify(building["region_name"])
        )
      );
    }

    filterResults = filterResults.filter((building) => {
      const searchLower = searchFilter.current.value.toLowerCase();
      return (
        building["nickname"].toLowerCase().includes(searchLower) ||
        building["description"].toLowerCase().includes(searchLower) ||
        (building["address_line_1"] + " " + building["address_line_2"])
          .toLowerCase()
          .includes(searchLower)
      );
    });

    if (sortSetting !== "") {
      filterResults.sort((building_1, building_2) => {
        switch (sortSetting) {
          case "Naam":
            return building_1["nickname"].toLowerCase() >
              building_2["nickname"].toLowerCase()
              ? 1
              : -1;
          case "Adres":
            return (
              building_1["address_line_1"] +
              " " +
              building_1["address_line_2"].toLowerCase()
            ).toLowerCase() >
              (
                building_2["address_line_1"].toLowerCase() +
                " " +
                building_2["address_line_2"].toLowerCase()
              ).toLowerCase()
              ? 1
              : -1;
        }
      });
    }

    setSearchResults(filterResults);
  };

  const updateRegionFilter = (selectionList) => {
    setSelectedRegions(selectionList);
    filter({ regions: selectionList });
  };

  const updateSorting = (selection) => {
    setSortingSetting(selection.length ? selection[0] : "");
    filter({ sort: selection[0] });
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

  const ManualButton = () => {
    if (buildingDetail.manual !== null)
      return (
        <div className={"pt-3"}>
          <PrimaryButton
            onClick={() =>
              window.open(buildingDetail.manual, "_blank", "noreferrer")
            }
          >
            Handleiding
          </PrimaryButton>
        </div>
      );
  };

  return (
    <>
      <Head>
        <title>Gebouwen</title>
      </Head>
      <div className={"h-4/5"}>
        <PrimaryCard className={"m-2"}>
          <div className={"flex justify-between"}>
            <div className={"flex"}>
              <Dropdown
                icon={faFilter}
                text={"Filter"}
                className={"mr-2"}
                options={regionList.map((region) => region["region_name"])}
                multi={true}
                onClick={updateRegionFilter}
              >
                Filter Regio
              </Dropdown>
              <Dropdown
                icon={faSort}
                text={"Sort"}
                className={"mr-2"}
                options={["Naam", "Adres"]}
                onClick={updateSorting}
              >
                Sorteer
              </Dropdown>
              <InputField
                classNameDiv={"w-80"}
                reference={searchString}
                icon={faSearch}
                actionCallback={() => filter()}
              />
            </div>
            <PrimaryButton
              icon={faPlusCircle}
              text={"Sort"}
              onClick={() => {
                router.push("/beheer/data_toevoegen/gebouwen");
              }}
            >
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
                      <PrimaryButton
                        icon={faPenToSquare}
                        className={"h-fit"}
                        onClick={() =>
                          router.push(
                            "/beheer/data_toevoegen/gebouwen/" +
                              urlToPK(buildingURL)
                          )
                        }
                      >
                        Bewerk
                      </PrimaryButton>
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
                              {owner["first_name"] + " " + owner.last_name}
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
                          className={"pt-3  h-[420px] w-full"}
                          address={
                            buildingDetail.address_line_1 +
                            " " +
                            buildingDetail.address_line_2
                          }
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
                      <ManualButton />
                    </SecondaryCard>
                    <SecondaryCard
                      title={"Foto's"}
                      icon={faImage}
                      className={"my-2 "}
                    >
                      <div className={"flex overflow-x-auto"}>
                        {photos.map((photo) => (
                          <div className={"flex-shrink-0"} key={photo["url"]}>
                            <PrimaryCard className={"mr-3"}>
                              <img src={photo["image"]} width="200px" alt="" />
                            </PrimaryCard>
                          </div>
                        ))}
                      </div>
                    </SecondaryCard>
                    <SecondaryCard
                      title={"Opmerkingen"}
                      icon={faComment}
                      className={"my-2"}
                    >
                      {comments.map((comment) => (
                        <PrimaryCard key={comment["url"]} className={"mb-3"}>
                          <div className={"flex align-top"}>
                            <p className={"text-lg font-bold"}>
                              {comment["user"]["first_name"]}{" "}
                              {comment["user"]["last_name"]}
                            </p>
                            <div className={"grow"} />
                            {comment["user"]["role"] === 5 ? (
                              <p className={"mr-5 text-light-h-2 italic"}>
                                student
                              </p>
                            ) : null}
                            {comment["updated_at"] ? (
                              <>
                                <p className={"text-light-h-2 mr-2 mt-1"}>
                                  {comment["updated_at"]
                                    .split("T")[1]
                                    .split("+")[0] +
                                    " " +
                                    comment["updated_at"]
                                      .split("T")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")}
                                </p>
                                <FontAwesomeIcon
                                  icon={faPencil}
                                  className={"mt-2"}
                                  style={{ color: "gray" }}
                                />
                              </>
                            ) : (
                              <p className={"text-light-h-2"}>
                                {comment["created_at"]
                                  .split("T")[1]
                                  .split("+")[0] +
                                  " " +
                                  comment["created_at"]
                                    .split("T")[0]
                                    .split("-")
                                    .reverse()
                                    .join("-")}
                              </p>
                            )}
                          </div>
                          <p>{comment["text"]}</p>
                        </PrimaryCard>
                      ))}
                    </SecondaryCard>
                  </div>
                </div>
              </div>
            )}
          </PrimaryCard>
          <div className={"m-2 basis-1/4 max-h-4/5"}>
            <PrimaryCard title={"Selecteer week"} className={"mb-3"}>
              <CustomWeekPicker
                startDate={selectionStartDate}
                endDate={selectionEndDate}
                onChange={(newStartDate, newEndDate) => {
                  setSelectionStartDate(newStartDate);
                  setSelectionEndDate(newEndDate);
                  loadPhotos(buildingURL, newStartDate, newEndDate);
                  loadComments(buildingURL, newStartDate, newEndDate);
                }}
                className="!light-bg-1"
              />
            </PrimaryCard>
            <SelectionList
              title={"Gebouwen"}
              elements={searchResults}
              className={"h-full mt-3"}
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
      </div>
    </>
  );
}

Buildings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
