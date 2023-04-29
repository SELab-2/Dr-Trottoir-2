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

/**
 *
 * @param onSubmit
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
export default function BuildingForm({ id }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      if (router.query.id) {
        const data = await BuildingService.getById(router.query.id);
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
  }, [router.query.id]);

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={"flex flex-col space-y-2"}>
      <div className={"flex flex-col space-y-2"}>
        <label htmlFor="name" className={"font-bold"}>
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={
            "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={"flex flex-col space-y-2"}>
        <label htmlFor="description" className={"font-bold"}>
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className={
            "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
          }
          value={description}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={"flex flex-col space-y-2"}>
        <label htmlFor="address1" className={"font-bold"}>
          Address line 1
        </label>
        <input
          type="text"
          name="address1"
          id="address1"
          className={
            "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
          }
          value={address1}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={"flex flex-col space-y-2"}>
        <label htmlFor="address2" className={"font-bold"}>
          Address line 2
        </label>
        <input
          type="text"
          name="address2"
          id="address2"
          className={
            "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
          }
          value={address2}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={"flex flex-col space-y-2"}>
        <label htmlFor="country" className={"font-bold"}>
          Country
        </label>
        <input
          type="text"
          name="country"
          id="country"
          className={
            "bg-light-bg-2 border-2 rounded-lg border-light-h-2 p-2 outline-none"
          }
          value={country}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

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

      <div className={"flex flex-row space-x-2"}>
        <PrimaryButton icon={faPlusCircle} type={"submit"}>
          Opslaan
        </PrimaryButton>
        <CustomButton
          icon={faMinusCircle}
          className={
            "bg-bad-1 text-dark-h-1 hover:bg-bad-1 active:bg-bad-2 active:text-bad-1"
          }
        >
          Verwijder
        </CustomButton>
      </div>
    </form>
  );
}
