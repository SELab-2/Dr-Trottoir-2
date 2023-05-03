import { useEffect, useState } from "react";
import BuildingService from "@/services/building.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TourService from "@/services/tour.service";
import TourBuildingAdd from "@/components/forms/forms-components/TourBuildingAdd";

export default function TourForm({ id }) {
  const [loading, setLoading] = useState(true);

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  ////////////////////////////////////////////////

  const onSubmit = (event) => {
    event.preventDefault();
    alert(`You have submitted the form.`);
  };

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      setLoading(true);
      if (id) {
        //set Name tour
        const data = await TourService.getById(id);
        setName(data.name);
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
    <BasicForm loading={loading} onSubmit={onSubmit}>
      <InputForm
        label={"Name"}
        id={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TourBuildingAdd tourId={id} />
    </BasicForm>
  );
}
