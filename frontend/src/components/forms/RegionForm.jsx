import { useEffect, useState } from "react";
import TourService from "@/services/tour.service";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-components/forms-input/InputForm";
import TourBuildingAdd from "@/components/forms/forms-components/TourBuildingAdd";

export default function RegionForm({ id }) {
  const [loading, setLoading] = useState(true);

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  ////////////////////////////////////////////////

  const onSubmit = (event) => {
    event.preventDefault();
    const data = { region_name: name };
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
        //set Name tour
        const data = await RegionForm.getById(id);
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
    <BasicForm loading={loading} onSubmit={onSubmit}>
      <InputForm
        label={"Region Name"}
        id={"region_name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </BasicForm>
  );
}
