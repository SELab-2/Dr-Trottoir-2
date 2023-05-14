import { useEffect, useState } from "react";
import TourService from "@/services/tour.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TourBuildingAdd from "@/components/forms/forms-components/TourBuildingAdd";
import VisitService from "@/services/visit.service";
import RegionService from "@/services/region.service";
import { urlToPK } from "@/utils/urlToPK";
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

      await router.push(`/admin/data_toevoegen/regio`);
    } catch (e) {
      alert(e);
    }
  };

  const onDelete = async () => {
    try {
      await RegionService.deleteById(id);
      await router.push(`/admin/data_toevoegen/regio`);
    } catch (e) {
      alert(e);
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
      editMode={id !== undefined}
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
