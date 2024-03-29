import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import RegionService from "@/services/region.service";
import { useRouter } from "next/router";

export default function RegionForm({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  ////////////////////////////////////////////////

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = { region_name: name };
    try {
      if (id) {
        await RegionService.patchById(id, data);
      } else {
        await RegionService.post(data);
      }

      await router.reload();
    } catch (e) {
      alert(e);
    }
  };

  const onDelete = async () => {
    try {
      await RegionService.deleteById(id);
      await router.push(`/beheer/data_toevoegen/regio`);
    } catch (e) {
      alert(JSON.stringify(e.response.data));
    }
  };

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      setLoading(true);
      if (id) {
        //set Name tour
        const data = await RegionService.getById(id);
        setName(data.region_name);
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

  return (
    <BasicForm
      loading={loading}
      onSubmit={onSubmit}
      onDelete={onDelete}
      model={"regio"}
      allowRemove={id !== undefined}
    >
      <InputForm
        label={"Naam Regio"}
        id={"region_name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </BasicForm>
  );
}
