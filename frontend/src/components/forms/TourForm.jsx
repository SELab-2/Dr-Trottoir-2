import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TourService from "@/services/tour.service";
import TourBuildingAdd from "@/components/forms/forms-components/TourBuildingAdd";
import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import RegionService from "@/services/region.service";
import { useRouter } from "next/router";
import { urlToPK } from "@/utils/urlToPK";

export default function TourForm({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  const [selectedB, setSelectedB] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [region, setRegion] = useState("");
  ////////////////////////////////////////////////

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = { name: name, buildings: selectedB, region: region };
    try {
      if (id) {
        const response = await TourService.patchById(id, data);
        await router.push(
          `/beheer/data_toevoegen/rondes/${urlToPK(response.url)}`
        );
      } else {
        await TourService.post(data);
      }

      await router.reload();
    } catch (e) {
      alert(JSON.stringify(e.response.data));
    }
  };

  const onDelete = async () => {
    try {
      await TourService.deleteById(id);
      await router.push(`/beheer/data_toevoegen/rondes`);
    } catch (e) {
      alert(e);
    }
  };

  const changeSelected = (buildings) => {
    setSelectedB(
      buildings.map((building) => ({
        building: building.building.url,
        order_index: building.order_index,
      }))
    );
  };

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      setLoading(true);
      if (id) {
        //set Name tour
        const data = await TourService.getById(id);
        setName(data.name);
        setRegion(data.region);
      }
      setAllRegions(await RegionService.get());
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
      model={"ronde"}
      allowRemove={id !== undefined}
    >
      <InputForm
        label={"Name"}
        id={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TourBuildingAdd tourId={id} callback={changeSelected} />

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
    </BasicForm>
  );
}
