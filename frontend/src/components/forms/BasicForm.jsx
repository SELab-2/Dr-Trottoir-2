import Loading from "@/components/Loading";
import PrimaryButton from "@/components/button/PrimaryButton";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/button/Button";

export default function BasicForm({ children, onSubmit, className, loading }) {
  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={"flex flex-col space-y-2"}>
      {children}
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
