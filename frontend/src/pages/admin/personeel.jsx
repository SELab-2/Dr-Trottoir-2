import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { BG_LIGHT_SECONDARY } from "@/utils/colors";
import {
  faCirclePlus,
  faMagnifyingGlass,
  faFilter,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import ContextMenu from "@/components/ContextMenu";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInputField from "@/components/input-fields/InputField";
import userService from "@/services/user.service";
import ColoredTag from "@/components/Tag";
import CustomDropDown from "@/components/DropDown";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  rowOptions: [],
};

// TO DO: Split up page
export default function Employees() {
  const [response, setResponse] = useState("{}");
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [filterSelected, setFilterSelected] = useState(new Set());
  const [sortSelected, setSortSelected] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const allUsers = async () => {
      const response = await userService.getAll();
      setResponse(JSON.stringify(response, null, 2));
      let user = [];

      if (Object.prototype.hasOwnProperty.call(response, "results")) {
        const results = response["results"];
        for (let i in results) {
          let entry = results[i];
          if (entry["role"] !== 4) {
            user.push({
              pk: urlToPK(entry["url"]),
              first_name: entry["first_name"],
              last_name: entry["last_name"],
              email: entry["email"],
              role: entry["role"],
            });
          }
        }
        setUsers(user);
        setAllUsers(user);
      }
    };
    allUsers();
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

  // Add color for owner
  const roleToString = {
    1: "Developer",
    2: "Admin",
    3: "Superstudent",
    5: "Student",
  };

  const stringToField = {
    Voornaam: "first_name",
    Achternaam: "last_name",
    "E-mailadres": "email",
    Rol: "role",
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
      deleteUsers();
    } else if (option == "Mail") {
      mailUsers();
    }
    setContextMenu(initialContextMenu);
  };

  const singleRowOptions = ["Edit", "Delete", "Mail"];

  const multipleRowOptions = ["Delete", "Mail"];

  const changeSortSelected = (option) => {
    setSortSelected(option);
    setUsers(
      users.sort(function (a, b) {
        const field = stringToField[option];
        if (typeof a[field] === "string") {
          return a[field].localeCompare(b[field]);
        } else {
          return a[field] - b[field];
        }
      })
    );
  };

  const changeFilterSelected = (newSelected) => {
    setSelectedRows(new Set());
    setFilterSelected(newSelected);
    if (newSelected.size === 0) {
      setUsers(allUsers);
    } else {
      setUsers(
        allUsers.filter((user) => newSelected.has(roleToString[user.role]))
      );
    }
  };

  const clickSearch = () => {
    setSelectedRows(new Set());
    const searchStr = searchRef.current.value;
    const usersCopy = allUsers.filter(
      (user) =>
        user.first_name.includes(searchStr) ||
        user.last_name.includes(searchStr) ||
        user.email.includes(searchStr)
    );
    setUsers(usersCopy);
  };

  return (
    <>
      <Head>
        <title>Personeel</title>
      </Head>
      <main
        className={`h-screen p-8 flex-col justify-between`}
        style={{ backgroundColor: BG_LIGHT_SECONDARY }}
      >
        <PrimaryCard>
          <div
            className={
              "relative space-x-2 flex flex-row justify-center items-start"
            }
          >
            <div>
              <CustomDropDown
                title="Filter"
                icon={faFilter}
                options={["Developer", "Admin", "Student", "Superstudent"]}
                selected={filterSelected}
                handleChange={changeFilterSelected}
              />
            </div>
            <div>
              <CustomDropDown
                title="Sorteer"
                icon={faSort}
                options={["Voornaam", "Achternaam", "E-mailadres", "Rol"]}
                selected={sortSelected}
                handleChange={changeSortSelected}
                multi={false}
              />
            </div>
            <div className="flex-grow mt-3">
              <CustomInputField
                icon={faMagnifyingGlass}
                reference={searchRef}
                callback={() => clickSearch()}
                onKeyDown={(e) => {
                  clickSearch();
                }}
              ></CustomInputField>
            </div>
            <div>
              <PrimaryButton text="Nieuw" icon={faCirclePlus}></PrimaryButton>
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
                  Rol
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
                      ? "bg-selected-bg text-selected-h"
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
                    <ColoredTag className={`bg-tags-${user.role}`}>
                      {roleToString[user.role]}
                    </ColoredTag>
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
