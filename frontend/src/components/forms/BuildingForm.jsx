import { useEffect, useState } from "react";
import BuildingService from "@/services/building.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TextAreaForm from "@/components/forms/forms-components/forms-input/TextAreaForm";
import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import UserService from "@/services/user.service";
import Link from "next/link";
import { useRouter } from "next/router";
import RegionService from "@/services/region.service";
import { urlToPK } from "@/utils/urlToPK";

export default function BuildingForm({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // DATA ////////////////////////////////////////
  const [url, setUrl] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allOwners, setAllOwners] = useState([]);
  const [owner, setOwner] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [allRegions, setAllRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [currentManual, setCurrentManual] = useState(undefined);

  const [manual, setManual] = useState(undefined);

  ////////////////////////////////////////////////

  const onSubmit = async (event) => {
    event.preventDefault();

    let data = {
      nickname: name,
      description: description,
      address_line_1: address1,
      address_line_2: address2,
      country: country,
      region: region,
      owner: owner,
    };

    if (manual !== undefined) {
      data.manual = manual;
    }

    try {
      if (id) {
        await BuildingService.patchById(id, data);
      } else {
        await BuildingService.post(data);
      }
      if (owner !== "") {
        await BuildingService.putOwnersByUrl(url, [urlToPK(owner)]);
      }

      // await router.reload();
    } catch (e) {
      alert(JSON.stringify(e.response.data));
    }
  };

  const onDelete = async () => {
    try {
      await BuildingService.deleteById(id);
      await router.push(`/beheer/data_toevoegen/gebouwen`);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      setLoading(true);
      if (id) {
        const data = await BuildingService.getById(id);
        setUrl(data.url);
        setName(data.nickname);
        setDescription(data.description);
        setAddress1(data.address_line_1);
        setAddress2(data.address_line_2);
        setCountry(data.country);
        setCurrentManual(data.manual);
        setRegion(data.region);
        setOwner(data.owners[0] ? data.owners[0].url : "");
      }
      setAllRegions(await RegionService.get());
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
      onDelete={onDelete}
      model={"gebouw"}
      allowRemove={id !== undefined}
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
        value={owner}
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
