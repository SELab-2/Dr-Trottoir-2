import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import {
  faCirclePlus,
  faMagnifyingGlass,
  faFilter,
  faSort,
  faTrash,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInputField from "@/components/input-fields/InputField";
import userService from "@/services/user.service";
import ColoredTag from "@/components/Tag";
import Dropdown from "@/components/Dropdown";
import ContextMenu from "@/components/ContextMenu";
import buildingService from "@/services/building.service";
import SecondaryButton from "@/components/button/SecondaryButton";
import CustomButton from "@/components/button/Button";
import CustomModal from "@/components/CustomModal";
import SelectableTable from "@/components/table/SelectableTable";
import { urlToPK } from "@/utils/urlToPK";
import Layout from "@/components/Layout";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  rowOptions: [],
};

export default function Syndici() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [filterSelected, setFilterSelected] = useState([]);
  const [clearSelected, setClearSelected] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const allUsers = async () => {
      const response = await userService.get();
      let user = [];
      for (let i in response) {
        let entry = response[i];
        if (entry["role"] === 4) {
          user.push({
            pk: urlToPK(entry["url"]),
            first_name: entry["first_name"],
            last_name: entry["last_name"],
            email: entry["email"],
            role: entry["role"],
            buildings: entry["buildings"],
          });
        }
      }
      setUsers(user);
      setAllUsers(user);
    };

    const allBuildings = async () => {
      const response = await buildingService.get();
      let buildings = [];
      for (let i in response) {
        let entry = response[i];
        buildings.push({
          pk: urlToPK(entry["url"]),
          nickname: entry["nickname"],
          region_name: entry["region_name"],
        });
      }
      setBuildings(buildings);
    };
    allUsers();
    allBuildings();
  }, []);

  const stringToField = {
    Voornaam: "first_name",
    Achternaam: "last_name",
    "E-mailadres": "email",
    Gebouwen: "buildings",
  };

  const createBuildingCell = (buildings) => {
    return (
      <div>
        {buildings.map((building, index) => (
          <ColoredTag
            key={index}
            className={`cursor-pointer bg-light-bg-2 border-2 border-light-h-2`}
          >
            {building.nickname}
          </ColoredTag>
        ))}
      </div>
    );
  };

  const columns = [
    { name: "Voornaam", cut: false },
    { name: "Achternaam", cut: false },
    { name: "E-mailadres", cut: false },
    { name: "Gebouwen", cut: false, createCell: createBuildingCell },
  ];

  const handleRightClick = (event, selectedIndiches) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    let rowOptions = singleRowOptions;
    if (selectedIndiches.length > 1) {
      rowOptions = multipleRowOptions;
    }
    setContextMenu({
      show: true,
      x: pageX,
      y: pageY,
      rowOptions: rowOptions,
    });
    setSelectedRows(selectedIndiches);
  };

  const editUser = () => {
    // To be implemented
  };

  const deleteUsers = () => {
    let usersCopy = [...users];
    let allUsersCopy = [...allUsers];
    let toBeDeleted = selectedRows.map((index) => usersCopy[index]["pk"]);
    usersCopy = usersCopy.filter((user) => !toBeDeleted.includes(user.pk));
    allUsersCopy = allUsersCopy.filter(
      (user) => !toBeDeleted.includes(user.pk)
    );
    toBeDeleted.forEach(async (pk) => {
      await userService.deleteById(pk);
    });
    setUsers(usersCopy);
    setModalOpen(false);
    setAllUsers(allUsersCopy);
    setClearSelected(clearSelected + 1);
  };

  const mailUsers = () => {
    // To be implemented
  };

  const closeContextMenu = (option) => {
    if (option === "Wijzig") {
      editUser();
    } else if (option === "Verwijder") {
      setModalOpen(true);
    } else if (option === "Mail") {
      mailUsers();
    }
    setContextMenu(initialContextMenu);
  };

  const singleRowOptions = ["Wijzig", "Verwijder", "Mail"];

  const multipleRowOptions = ["Verwijder", "Mail"];

  const changeSortSelected = (selected) => {
    setUsers(
      users.sort(function (a, b) {
        const field = stringToField[selected[0]];
        if (typeof a[field] === "string") {
          return a[field].localeCompare(b[field]);
        } else {
          return a[field] - b[field];
        }
      })
    );
    setClearSelected(clearSelected + 1);
  };

  const applySearch = (newFilterSelected) => {
    setFilterSelected(newFilterSelected);
    const searchStr = searchRef.current.value;
    let usersCopy = [...allUsers];
    if (searchStr !== "") {
      // apply searchbar
      usersCopy = usersCopy.filter(
        (user) =>
          user.first_name.includes(searchStr) ||
          user.last_name.includes(searchStr) ||
          user.email.includes(searchStr)
      );
    }
    if (newFilterSelected.length !== 0) {
      // Checks if a user is the owner of at least 1 of the selected buildings
      usersCopy = usersCopy.filter((user) => {
        const userBuildings = user.buildings.map(
          (building) => building.nickname
        );
        return newFilterSelected.some((building) =>
          userBuildings.includes(building)
        );
      });
    }
    setClearSelected(clearSelected + 1);
    setUsers(usersCopy);
  };

  return (
    <>
      <Head>
        <title>Syndici</title>
      </Head>
      <CustomModal isOpen={modalOpen} className="z-20">
        <h2 className="text-lg font-bold mb-4">
          Weet u zeker dat u de geselecteerde gebruikers wilt verwijderen?
        </h2>
        <div className="flex justify-center">
          <SecondaryButton
            className="mr-2"
            icon={faBan}
            onClick={() => setModalOpen(false)}
          >
            Annuleer
          </SecondaryButton>
          <CustomButton
            className="bg-bad-1 text-light-bg-1"
            icon={faTrash}
            onClick={deleteUsers}
          >
            Verwijder
          </CustomButton>
        </div>
      </CustomModal>
      <main className={`h-screen p-2 flex-col justify-between`}>
        <PrimaryCard className={"mb-4"}>
          <div
            className={
              "space-x-0 space-y-2 flex flex-col lg:justify-center lg:items-center lg:space-x-2 lg:space-y-0 lg:flex-row w-full"
            }
          >
            <div>
              <Dropdown
                icon={faFilter}
                options={buildings.map((building) => building.nickname)}
                onClick={applySearch}
              >
                Filter
              </Dropdown>
            </div>
            <div>
              <Dropdown
                icon={faSort}
                options={["Voornaam", "Achternaam", "E-mailadres"]}
                onClick={changeSortSelected}
              >
                Sorteer
              </Dropdown>
            </div>
            <div className="flex-grow">
              <CustomInputField
                icon={faMagnifyingGlass}
                reference={searchRef}
                actionCallback={() => applySearch(filterSelected)}
              ></CustomInputField>
            </div>
            <div>
              <PrimaryButton icon={faCirclePlus}>
                <span className="mx-5-3">Nieuw</span>
              </PrimaryButton>
            </div>
          </div>
        </PrimaryCard>
        <PrimaryCard>
          <SelectableTable
            columns={columns}
            data={users.map((user) => [
              user.first_name,
              user.last_name,
              user.email,
              user.buildings,
            ])}
            rightClick={handleRightClick}
            clearSelected={clearSelected}
            className={"w-full"}
          ></SelectableTable>
          {contextMenu.show && (
            <ContextMenu
              x={contextMenu.x - 256}
              y={contextMenu.y}
              closeContextMenu={closeContextMenu}
              options={contextMenu.rowOptions}
            ></ContextMenu>
          )}
        </PrimaryCard>
      </main>
    </>
  );
}

Syndici.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
