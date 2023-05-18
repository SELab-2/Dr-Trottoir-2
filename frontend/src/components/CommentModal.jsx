import {
  faCirclePlus,
  faComment,
  faSquarePlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryCard from "./custom-card/PrimaryCard";
import CustomButton from "./button/Button";
import { useRef, useState } from "react";
import PrimaryButton from "./button/PrimaryButton";
import Modal from "react-modal";
import visitService from "@/services/visit.service";
export default function CommentModal({
  visitUrl,
  className,
  callback = () => {},
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const CommentRef = useRef(null);

  async function saveComment() {
    let data = {
      text: CommentRef.current.value,
      visit: visitUrl,
    };
    await visitService.postVisitComment(data);
    callback();
    closeModal();
  }

  function openModal() {
    if (visitUrl !== null) {
      setIsOpen(true);
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={className}>
      <FontAwesomeIcon
        icon={faSquarePlus}
        className="ml-auto pr-1 text-primary-1 text-lg cursor-pointer"
        onClick={openModal}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{ content: { width: "100%", inset: "0px" } }}
      >
        <PrimaryCard
          title={"Schrijf een opmerking"}
          icon={faComment}
          className={"w-full"}
        >
          <div className={"w-full"}>
            <textarea
              className={"border-2 rounded-lg w-full resize-none p-2"}
              ref={CommentRef}
            />
            <div className={"flex flex-row"}>
              <PrimaryButton
                className={"w-full"}
                icon={faCirclePlus}
                onClick={saveComment}
              >
                Opslaan
              </PrimaryButton>
            </div>
          </div>
          <CustomButton
            className={"bg-bad-1 text-dark-h-1 w-full"}
            onClick={closeModal}
            icon={faXmark}
          >
            Annuleren
          </CustomButton>
        </PrimaryCard>
      </Modal>
    </div>
  );
}
