import { useEffect, useState } from "react";
import BuildingService from "@/services/building.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TourService from "@/services/tour.service";
import TourBuildingAdd from "@/components/forms/forms-components/TourBuildingAdd";
import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import RegionService from "@/services/region.service";
import { urlToPK } from "@/utils/urlToPK";

export default function TourForm({ id }) {
  const [loading, setLoading] = useState(true);

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  const [selectedB, setSelectedB] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [region, setRegion] = useState(-1);
  ////////////////////////////////////////////////

  const onSubmit = (event) => {
    event.preventDefault();
    const data = { name: name, buildings: selectedB, region: region };
    alert(
      `You have submitted the form. 
      The data you want to submit is: ${JSON.stringify(data)}`
    );
  };

  const changeSelected = (buildings) => {
    setSelectedB(
      buildings.map((building) => ({
        building: urlToPK(building.building.url),
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
        setRegion(urlToPK(data.region));
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
      model={"ronde"}
      editMode={id !== undefined}
    >
      <InputForm
        label={"Name"}
        id={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TourBuildingAdd tourId={id} callback={changeSelected} />

      <SelectForm
        id={"regio"}
        label={"Regio"}
        onChange={(e) => setRegion(e.target.value)}
        className={"flex-grow"}
        value={region}
      >
        {allRegions.map((reg, index) => {
          return (
            <option key={urlToPK(reg.url)} value={urlToPK(reg.url)}>
              {reg.region_name}
            </option>
          );
        })}
        )
      </SelectForm>
    </BasicForm>
  );
}
