import PrimaryButton from "@/components/button/PrimaryButton";
import CustomButton from "@/components/button/Button";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

/**
 *
 * @param onSubmit
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
export default function BuildingForm({ onSubmit, data }) {
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
        >
          {data && data.nickname}
        </input>
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
        >
          {data && data.description}
        </textarea>
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
        >
          {data && data.address_line_1}
        </input>
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
        >
          {data && data.address_line_2}
        </input>
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
        >
          {data && data.country}
        </input>
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
        >
          {data && data.manual}
        </input>
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
