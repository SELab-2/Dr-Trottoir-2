import Loading from "@/components/Loading";
import PrimaryButton from "@/components/button/PrimaryButton";
import {
  faBan,
  faMinusCircle,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/button/Button";
import SecondaryButton from "@/components/button/SecondaryButton";
import CustomModal from "@/components/Modals/CustomModal";
import { useState } from "react";
import RemoveModal from "@/components/Modals/RemoveModal";

export default function BasicForm({
  model,
  allowRemove = false,
  allowAdd = true,
  children,
  onSubmit,
  onDelete,
  className,
  loading,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const onClickDelete = () => {
    setModalOpen(false);
    onDelete();
  };

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  return (
    <div>
      <RemoveModal
        element={model}
        onDelete={onClickDelete}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
      />
      <form onSubmit={onSubmit} className={"flex flex-col space-y-2"}>
        {children}
        <div className={"flex flex-row space-x-2"}>
          {allowAdd && (
            <PrimaryButton icon={faPlusCircle} type={"submit"}>
              Opslaan
            </PrimaryButton>
          )}
          {allowRemove && (
            <CustomButton
              icon={faMinusCircle}
              type="button"
              className={
                "bg-bad-1 text-dark-h-1 hover:bg-bad-1 active:bg-bad-2 active:text-bad-1"
              }
              onClick={() => setModalOpen(true)}
            >
              Verwijder
            </CustomButton>
          )}
        </div>
      </form>
    </div>
  );
}
