import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { BG_LIGHT_SECONDARY } from "@/utils/colors";
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
import Dropdown from "@/components/DropDown";
import ContextMenu from "@/components/ContextMenu";
import buildingService from "@/services/building.service";
import SecondaryButton from "@/components/button/SecondaryButton";
import CustomButton from "@/components/button/Button";
import CustomModal from "@/components/CustomModal";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  rowOptions: [],
};

// TO DO: Split up page
export default function Syndici() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [filterSelected, setFilterSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const allUsers = async () => {
      const response = await userService.getAll();
      let user = [];

      if (Object.prototype.hasOwnProperty.call(response, "results")) {
        const results = response["results"];
        for (let i in results) {
          let entry = results[i];
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
      }
    };

    const allBuildings = async () => {
      const response = await buildingService.getAll();
      let buildings = [];
      if (Object.prototype.hasOwnProperty.call(response, "results")) {
        const results = response["results"];
        for (let i in results) {
          let entry = results[i];
          buildings.push({
            pk: urlToPK(entry["url"]),
            nickname: entry["nickname"],
            region_name: entry["region_name"],
          });
        }
        setBuildings(buildings);
      }
    };
    allUsers();
    allBuildings();
  }, []);

  // Extract the primary key from the url of a user
  function urlToPK(url) {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match !== null) {
      const primaryKey = match[1];
      return primaryKey;
    }
  }

  const stringToField = {
    Voornaam: "first_name",
    Achternaam: "last_name",
    "E-mailadres": "email",
    Gebouwen: "buildings",
  };

  const handleRightClick = (event, pk) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    selectedRows.add(pk);
    let rowOptions = singleRowOptions;
    if (selectedRows.size > 1) {
      rowOptions = multipleRowOptions;
    }
    setContextMenu({
      show: true,
      x: pageX,
      y: pageY,
      rowOptions: rowOptions,
    });
  };

  const handleClickRow = (event, pk) => {
    const updatedRows = new Set(selectedRows);
    if (updatedRows.has(pk)) {
      updatedRows.delete(pk);
    } else {
      updatedRows.add(pk);
    }
    setSelectedRows(updatedRows);
  };

  const editUser = () => {
    // To be implemented
  };

  const deleteUsers = () => {
    let usersCopy = [...users];
    let allUsersCopy = [...allUsers];
    usersCopy = usersCopy.filter((user) => !selectedRows.has(user.pk));
    allUsersCopy = allUsersCopy.filter((user) => !selectedRows.has(user.pk));
    selectedRows.forEach(async (pk) => {
      // for development purposes
      if (pk !== "1") {
        await userService.deleteUser(pk);
      }
    });
    setUsers(usersCopy);
    setAllUsers(allUsersCopy);
  };

  const mailUsers = () => {
    // To be implemented
  };

  const closeContextMenu = (option) => {
    if (option == "Edit") {
      editUser();
    } else if (option == "Delete") {
      setModalOpen(true);
    } else if (option == "Mail") {
      mailUsers();
    }
    setContextMenu(initialContextMenu);
  };

  const singleRowOptions = ["Edit", "Delete", "Mail"];

  const multipleRowOptions = ["Delete", "Mail"];

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
  };

  const applySearch = (newFilterSelected) => {
    setSelectedRows(new Set()); // remove selected rows when filtering
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
      // Checks if a user is the owner of at least 1 of the selected buildigns
      usersCopy = usersCopy.filter((user) => {
        const userBuildings = user.buildings.map(
          (building) => building.nickname
        );
        return newFilterSelected.some((building) =>
          userBuildings.includes(building)
        );
      });
    }
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
      <main
        className={`h-screen p-8 flex-col justify-between`}
        style={{ backgroundColor: BG_LIGHT_SECONDARY }}
      >
        <PrimaryCard className={"mb-4"}>
          <div
            className={
              "space-x-0 flex flex-col lg:justify-center lg:items-start lg:space-x-2 lg:flex-row w-full"
            }
          >
            <div className="mt-2">
              <Dropdown
                icon={faFilter}
                options={buildings.map((building) => building.nickname)}
                onClick={applySearch}
              >
                <div className="mx-5">Filter</div>
              </Dropdown>
            </div>
            <div className="my-2">
              <Dropdown
                icon={faSort}
                options={["Voornaam", "Achternaam", "E-mailadres"]}
                onClick={changeSortSelected}
              >
                <div className="mx-5">Sorteer</div>
              </Dropdown>
            </div>
            <div className="flex-grow">
              <CustomInputField
                icon={faMagnifyingGlass}
                reference={searchRef}
                callback={() => applySearch(filterSelected)}
              ></CustomInputField>
            </div>
            <div className="mt-2">
              <PrimaryButton icon={faCirclePlus}>
                <span className="mx-5-3">Nieuw</span>
              </PrimaryButton>
            </div>
          </div>
        </PrimaryCard>
        <PrimaryCard>
          {
            // Will be replaced by table component
          }
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left uppercase tracking-wider"
                />
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Voornaam
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Achternaam
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  E-mailadres
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gebouwen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user.pk}
                  onContextMenu={(event) => handleRightClick(event, user.pk)}
                  onClick={(event) => handleClickRow(event, user.pk)}
                  className={`${
                    selectedRows.has(user.pk)
                      ? "bg-primary-2 text-selected-h"
                      : "hover:bg-light-bg-2"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {index + 1 + "."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.first_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.buildings.map((building, building_index) => (
                      <ColoredTag
                        key={building_index}
                        className={`cursor-pointer bg-light-bg-2 border-2 border-light-h-2`}
                      >
                        {building.nickname}
                      </ColoredTag>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contextMenu.show && (
            <ContextMenu
              x={contextMenu.x}
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
