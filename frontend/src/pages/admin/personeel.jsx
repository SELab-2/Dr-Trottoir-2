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
import ContextMenu from "@/components/ContextMenu";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInputField from "@/components/input-fields/InputField";
import userService from "@/services/user.service";
import ColoredTag from "@/components/Tag";
import Dropdown from "@/components/Dropdown";
import CustomModal from "@/components/CustomModal";
import SecondaryButton from "@/components/button/SecondaryButton";
import CustomButton from "@/components/button/Button";
import SelectableTable from "@/components/table/SelectableTable";

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  rowOptions: [],
};

export default function Employees() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
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

  const createRoleCell = (role) => {
    return (
      <ColoredTag className={roleToClassName[role]}>
        {roleToString[role]}
      </ColoredTag>
    );
  };

  // Tailwindcss can't construct class names dynamically
  const roleToClassName = {
    1: "bg-tags-1",
    2: "bg-tags-2",
    3: "bg-tags-3",
    5: "bg-tags-5",
  };

  const columns = [
    { name: "Voornaam", cut: false },
    { name: "Achternaam", cut: false },
    { name: "E-mailadres", cut: false },
    { name: "Rol", cut: false, createCell: createRoleCell },
  ];

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
      await userService.deleteUser(pk);
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
    if (option == "Wijzig") {
      editUser();
    } else if (option == "Verwijder") {
      setModalOpen(true);
    } else if (option == "Mail") {
      mailUsers();
    }
    setContextMenu(initialContextMenu);
  };

  const singleRowOptions = ["Wijzig", "Verwijder", "Mail"];

  const multipleRowOptions = ["Verwijder", "Mail"];

  const changeSortSelected = (selected) => {
    console.log(selected);
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
      // Checks if user has a role that is in the selected roles
      usersCopy = usersCopy.filter((user) =>
        newFilterSelected.includes(roleToString[user.role])
      );
    }
    setClearSelected(clearSelected + 1);
    setUsers(usersCopy);
  };

  return (
    <>
      <Head>
        <title>Personeel</title>
      </Head>
      <CustomModal isOpen={modalOpen} className="z-20 bg-light-bg-1">
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
                options={["Developer", "Admin", "Student", "Superstudent"]}
                onClick={applySearch}
                multi={true}
              >
                Filter
              </Dropdown>
            </div>
            <div className="my-2">
              <Dropdown
                icon={faSort}
                options={["Voornaam", "Achternaam", "E-mailadres", "Rol"]}
                onClick={changeSortSelected}
              >
                Sorteer
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
          <SelectableTable
            columns={columns}
            data={users.map((user) => [
              user.first_name,
              user.last_name,
              user.email,
              user.role,
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
