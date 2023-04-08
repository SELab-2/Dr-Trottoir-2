import { useState, useEffect } from "react";
import Head from "next/head";
import { PrimaryCard } from "@/components/CustomCard";
import { BG_LIGHT_SECONDARY } from "@/utils/colors";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { PrimaryButton } from "@/components/Button";
import { SecondaryButton } from "@/components/Button";
import { UserService } from "@/services/user.service";
import ContextMenu from "@/components/ContextMenu";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};

export default function Employees() {
  const [response, setResponse] = useState("{}");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  useEffect(() => {
    const allUsers = async () => {
      const response = await UserService.getAll();
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
  }, []);

  const handleRightClick = (event, user) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    setSelectedUser(user);
    setContextMenu({ show: true, x: pageX, y: pageY });
  };

  const closeContextMenu = () => setContextMenu(initialContextMenu);

  const editRow = () => console.log("edit row");
  const deleteRow = () => console.log("delete row");
  const mailRow = () => console.log("mail row");
  const rowOptions = [
    ["Edit", editRow],
    ["Delete", deleteRow],
    ["Mail", mailRow],
  ];

  return (
    <>
      <Head>
        <title>Personeel</title>
      </Head>
      <main
        className={`h-screen p-12 flex-col justify-between`}
        style={{ backgroundColor: BG_LIGHT_SECONDARY }}
      >
        <PrimaryCard class_style=" space-x-2 flex flex-col lg:flex-row lg:flex-wrap">
          <SecondaryButton text="Filter" icon={faCirclePlus}></SecondaryButton>
          <SecondaryButton text="Sort" icon={faCirclePlus}></SecondaryButton>
          InputField
          <PrimaryButton text="Nieuw" icon={faCirclePlus}></PrimaryButton>
        </PrimaryCard>
        <PrimaryCard>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Index
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={index}
                  onContextMenu={(event) => handleRightClick(event, user)}
                >
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
                    {user.role}
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
              options={rowOptions}
            ></ContextMenu>
          )}
        </PrimaryCard>
      </main>
    </>
  );
}
