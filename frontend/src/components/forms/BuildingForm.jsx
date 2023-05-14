import { useEffect, useState } from "react";
import BuildingService from "@/services/building.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TextAreaForm from "@/components/forms/forms-components/forms-input/TextAreaForm";
import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import UserService from "@/services/user.service";
import Link from "next/link";

export default function BuildingForm({ id }) {
  const [loading, setLoading] = useState(true);

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allOwners, setAllOwners] = useState([]);
  const [owner, setOwner] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [currentManual, setCurrentManual] = useState(undefined);

  const [manual, setManual] = useState(undefined);

  ////////////////////////////////////////////////

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(manual);
    const data = {
      nickname: name,
      description: description,
      address_line_1: address1,
      address_line_2: address2,
      country: country,
      manual: manual,
      owner: owner,
    };
    alert(
      `You have submitted the form. 
      The data you want to submit is: ${JSON.stringify(data)}`
    );
  };

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      setLoading(true);
      if (id) {
        const data = await BuildingService.getById(id);
        setName(data.nickname);
        setDescription(data.description);
        setAddress1(data.address_line_1);
        setAddress2(data.address_line_2);
        setCountry(data.country);
        setCurrentManual(data.manual);
      }
      setAllOwners(await UserService.get({ roles: [4] }));
    }

    fetchData()
      .then(() => setLoading(false))
      .catch();
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  return (
    <BasicForm
      loading={loading}
      onSubmit={onSubmit}
      model={"gebouw"}
      editMode={id !== undefined}
    >
      <InputForm
        label={"Naam"}
        id={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextAreaForm
        id={"description"}
        label={"Beschrijving"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <SelectForm
        id={"owner"}
        label={"Eigenaar"}
        onChange={(e) => setOwner(e.target.value)}
        required
      >
        {allOwners.map((owner) => {
          return (
            <option key={owner.url} value={owner.url}>
              {owner.first_name + " " + owner.last_name}
            </option>
          );
        })}
      </SelectForm>

      <InputForm
        label={"Straat + Nr."}
        id={"address1"}
        value={address1}
        onChange={(e) => setAddress1(e.target.value)}
        required
      />

      <InputForm
        label={"Gemeente/stad + postcode"}
        id={"address2"}
        value={address2}
        onChange={(e) => setAddress2(e.target.value)}
        required
      />

      <InputForm
        label={"Land"}
        id={"country"}
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      />

      <InputForm
        type={"file"}
        label={"Handleiding"}
        id={"manual"}
        onChange={(e) => {
          setManual(e.target.files[0]);
        }}
      />
      {currentManual && (
        <Link
          href={currentManual}
          target="_blank"
          className={"text-primary-1 underline"}
        >
          Huidige handleiding
        </Link>
      )}
    </BasicForm>
  );
}