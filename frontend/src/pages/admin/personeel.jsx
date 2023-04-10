import { useState, useEffect } from "react";
import Head from "next/head";
import { BG_LIGHT_SECONDARY } from "@/utils/colors";
import {
  faCirclePlus,
  faMagnifyingGlass,
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

export default function Employees() {
  const [response, setResponse] = useState("{}");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [filterSelected, setFilterSelected] = useState(new Set());
  const [sortSelected, setSortSelected] = useState(null);

  useEffect(() => {
    const allUsers = async () => {
      const response = await userService.getAll();
      setResponse(JSON.stringify(response, null, 2));
      let user = [];

      if (Object.prototype.hasOwnProperty.call(response, "results")) {
        const results = response["results"];
        for (let i in results) {
          let entry = results[i];
          user.push({
            first_name: entry["first_name"],
            last_name: entry["last_name"],
            email: entry["email"],
            role: entry["role"],
          });
        }
        user.push({
          first_name: "Bob",
          last_name: "bobe",
          email: "Boby",
          role: 3,
        });
        setUsers(user);
      }
    };
    allUsers();
  }, []);

  // Add color for owner
  const roleToString = {
    1: "Admin",
    2: "Admin",
    3: "Superstudent",
    4: "Owner",
    5: "Student",
  };

  const handleRightClick = (event, index) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    setSelectedUser(index);
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

  const handleClickRow = (event, index) => {
    const updatedRows = new Set(selectedRows);
    if (updatedRows.has(index)) {
      updatedRows.delete(index);
    } else {
      updatedRows.add(index);
    }
    setSelectedRows(updatedRows);
  };

  const closeContextMenu = () => setContextMenu(initialContextMenu);

  const editRow = () => console.log("edit row");
  const deleteRow = () => console.log("delete row");
  const mailRow = () => console.log("mail row");
  const singleRowOptions = [
    ["Edit", editRow],
    ["Delete", deleteRow],
    ["Mail", mailRow],
  ];

  const multipleRowOptions = [
    ["Delete", deleteRow],
    ["Mail", mailRow],
  ];

  const changeSortSelected = (option) => {
    setSortSelected(option);
  };

  const changeFilterSelected = (newSelected) => {
    setFilterSelected(newSelected);
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
            <div className="relative">
              <CustomDropDown
                title="Filter"
                icon={faCirclePlus}
                options={["Admin", "Student", "Superstudent"]}
                selected={filterSelected}
                handleChange={changeFilterSelected}
              />
            </div>
            <div className="relative">
              <CustomDropDown
                title="Sorteer"
                icon={faCirclePlus}
                options={["Voornaam", "Familienaam", "E-mail", "Rol"]}
                selected={sortSelected}
                handleChange={changeSortSelected}
                multi={false}
              />
            </div>
            <div className="flex-grow mt-3">
              <CustomInputField icon={faMagnifyingGlass}></CustomInputField>
            </div>
            <div className="">
              <PrimaryButton text="Nieuw" icon={faCirclePlus}></PrimaryButton>
            </div>
          </div>
        </PrimaryCard>
        <PrimaryCard>
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
                  First Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={index}
                  onContextMenu={(event) => handleRightClick(event, index)}
                  onClick={(event) => handleClickRow(event, index)}
                  className={`${
                    selectedRows.has(index)
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
