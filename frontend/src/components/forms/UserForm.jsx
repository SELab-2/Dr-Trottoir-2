import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RegionService from "@/services/region.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import UserService from "@/services/user.service";

/**
 *
 * @param onSubmit
 * @param id
 * @returns {JSX.Element}
 * @constructor
 */
export default function UserForm({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // DATA ////////////////////////////////////////
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [active, setActive] = useState(false);
  const [role, setRole] = useState(5);
  const [lastLogin, setLastLogin] = useState("");
  const [allRegions, setAllRegions] = useState([]);

  ////////////////////////////////////////////////

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = {
      region: region,
      active: active,
      role: role,
    };
    alert(`Submit this data: ${JSON.stringify(data)}`);
  };

  const onDelete = async () => {
    alert("implement this");
  };

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      if (id) {
        const data = await UserService.getById(id);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setRegion(data.region);
        setEmail(data.email);
        setPhone(data.phone);
        setActive(data.active);
        setLastLogin(data.last_login);
        setRole(data.role);
        setAllRegions(await RegionService.get());
      }
    }

    fetchData()
      .then(() => setLoading(false))
      .catch();
  }, [id]);

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  if (!id) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <p>Selecteer een gebruiker</p>
      </div>
    );
  }

  return (
    <BasicForm
      loading={loading}
      onSubmit={onSubmit}
      onDelete={onDelete}
      model={"user"}
      editMode={true}
    >
      <div className={"flex flex-row space-x-2"}>
        <InputForm
          id={"first_name"}
          value={firstName}
          className={"flex-grow"}
          label={"Voornaam"}
          disabled
        />
        <InputForm
          id={"last_name"}
          value={lastName}
          className={"flex-grow"}
          label={"Achternaam"}
          disabled
        />
      </div>

      <div className={"flex flex-row space-x-2"}>
        <InputForm
          id={"email"}
          value={email}
          className={"flex-grow"}
          label={"Email"}
          disabled
        />
        <InputForm
          id={"phone"}
          value={phone}
          className={"flex-grow"}
          label={"Telefoon nummer"}
          disabled
        />
      </div>

      <SelectForm
        id={"regio"}
        label={"Regio"}
        onChange={(e) => setRegion(e.target.value)}
        className={"flex-grow"}
        value={region}
        required
      >
        {allRegions.map((reg) => {
          return (
            <option key={reg.url} value={reg.url}>
              {reg.region_name}
            </option>
          );
        })}
        )
      </SelectForm>

      <SelectForm
        id={"role"}
        label={"Functie"}
        required
        onChange={(e) => setRole(e.target.value)}
        value={role}
      >
        <option value={1}>Developer</option>
        <option value={2}>Administrator</option>
        <option value={3}>Superstudent</option>
        <option value={4}>Syndici</option>
        <option value={5}>Student</option>
      </SelectForm>
    </BasicForm>
  );
}
