import CustomModal from "@/components/Modals/CustomModal";
import SecondaryButton from "@/components/button/SecondaryButton";
import { faBan, faTrash } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/button/Button";

export default function RemoveModal({ element, open, onCancel, onDelete }) {
  return (
    <CustomModal isOpen={open} className="z-20">
      <h2 className="text-lg font-bold mb-4">
        Weet u zeker dat u de geselecteerde {element} wilt verwijderen?
      </h2>
      <div className="flex justify-center">
        <SecondaryButton className="mr-2" icon={faBan} onClick={onCancel}>
          Annuleer
        </SecondaryButton>
        <CustomButton
          className="bg-bad-1 text-light-bg-1"
          icon={faTrash}
          onClick={onDelete}
        >
          Verwijder
        </CustomButton>
      </div>
    </CustomModal>
  );
}
