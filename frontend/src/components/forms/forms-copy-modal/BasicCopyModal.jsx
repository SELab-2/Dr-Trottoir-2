import CustomModal from "@/components/Modals/CustomModal";
import SecondaryButton from "@/components/button/SecondaryButton";
import { faBan, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/button/Button";

export default function BasicCopyModal({
  open,
  onCancel,
  onCopy,
  loading,
  children,
  error,
}) {
  return (
    <CustomModal isOpen={open} className="z-20 space-y-2">
      <h2 className="text-lg font-bold mb-4">
        Weet u zeker dat u wilt kopiëren?
      </h2>
      {error && (
        <div className={"bg-bad-2 border-bad-1 p-2 border-2 rounded-lg"}>
          {error}
        </div>
      )}
      {children}
      <div className="flex justify-center">
        <SecondaryButton className="mr-2" icon={faBan} onClick={onCancel}>
          Annuleer
        </SecondaryButton>
        {!loading && (
          <CustomButton
            className="bg-primary-1 text-light-bg-1"
            icon={faCopy}
            onClick={onCopy}
          >
            Kopieer
          </CustomButton>
        )}
      </div>
    </CustomModal>
  );
}
