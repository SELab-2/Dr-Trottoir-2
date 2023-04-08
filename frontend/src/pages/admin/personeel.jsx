import { useState, useEffect } from "react";
import Head from "next/head";
import { BG_LIGHT_SECONDARY } from "@/utils/colors";
import {
  faCirclePlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import ContextMenu from "@/components/ContextMenu";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInputField from "@/components/input-fields/InputField";
import userService from "@/services/user.service";

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
      setUsers(user);
    }
  };
  allUsers();

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

  const handeClickRow = (event, index) => {
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
            className={"space-x-2 flex flex-row justify-center items-center"}
          >
            <div className="flex h-32">
              <SecondaryButton
                text="Filter"
                icon={faCirclePlus}
                className="flex-row"
              ></SecondaryButton>
            </div>
            <div className="flex h-32">
              <SecondaryButton
                text="Sort"
                icon={faCirclePlus}
              ></SecondaryButton>
            </div>
            <div className="flex-grow">
              <CustomInputField></CustomInputField>
            </div>
            <div className="flex h-32">
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
                  onClick={(event) => handeClickRow(event, index)}
                  className={`${
                    selectedRows.has(index) ? "bg-black selected" : ""
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
                    {user.role /* Convert to Tag component */}
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
