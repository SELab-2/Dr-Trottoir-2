import PrimaryButton from "@/components/button/PrimaryButton";
import CustomButton from "@/components/button/Button";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ScheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import BuildingService from "@/services/building.service";
import UserService from "@/services/user.service";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import BasicForm from "@/components/forms/BasicForm";
import InputForm from "@/components/forms/forms-input/InputForm";
import TextAreaForm from "@/components/forms/forms-input/TextAreaForm";

/**
 *
 * @param onSubmit
 * @returns {JSX.Element}
 * @constructor
 */
export default function BuildingForm({ id }) {
  const [loading, setLoading] = useState(true);

  // DATA ////////////////////////////////////////
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");

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
        const data = await BuildingService.getById(id);
        setName(data.nickname);
        setDescription(data.description);
        setAddress1(data.address_line_1);
        setAddress2(data.address_line_2);
        setCountry(data.country);
      }
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
    <BasicForm loading={loading} onSubmit={onSubmit}>
      <InputForm
        label={"Name"}
        id={"name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextAreaForm
        id={"description"}
        label={"Description"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <InputForm
        label={"Address line 1"}
        id={"address1"}
        value={address1}
        onChange={(e) => setAddress1(e.target.value)}
      />

      <InputForm
        label={"Address line 2"}
        id={"address2"}
        value={address2}
        onChange={(e) => setAddress2(e.target.value)}
      />

      <InputForm
        label={"Country"}
        id={"country"}
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <div className={"flex flex-col space-y-2"}>
        <label htmlFor="manual" className={"font-bold"}>
          Manual
        </label>
        <input
          type="file"
          name="manual"
          id="manual"
          className={
            "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
          }
        />
      </div>
    </BasicForm>
  );
}
