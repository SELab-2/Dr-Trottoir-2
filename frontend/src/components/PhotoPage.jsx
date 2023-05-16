import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import { faBriefcase, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomButton from "@/components/button/Button";
import VisitService from "@/services/visit.service";
import UserService from "@/services/user.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import BuildingService from "@/services/building.service";

export default function PhotoPage({ photo }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [person, setPerson] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getData = async () => {
      if (photo) {
        if (photo.state === 1) {
          setTitle("Aankomst");
        } else if (photo.state === 2) {
          setTitle("Vertrek");
        } else if (photo.state === 3) {
          setTitle("Extra");
        }
        const visit = await VisitService.getEntryByUrl(photo.visit);
        const user = await UserService.getEntryByUrl(visit.user);
        const buildingInTour = await BuildingInTourService.getEntryByUrl(
          visit.building_in_tour
        );
        const building = await BuildingService.getEntryByUrl(
          buildingInTour.building
        );
        setPerson(`${user.first_name} ${user.last_name} (${user.email})`);
        setAddress(
          `${building.address_line_1} ${building.address_line_2} (${building.nickname})`
        );
        console.log(visit);
        console.log(user);
        console.log(building);
      }
    };
    getData().catch();
  }, [photo]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function formatTime(time) {
    const date = new Date(time);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{ content: { width: "100%", inset: "0px" } }}
      >
        <PrimaryCard className={"space-y-2"} title={title}>
          {photo && (
            <div className={"flex flex-col space-y-2 h-full"}>
              <div className={"w-full rounded-lg border-2 overflow-hidden"}>
                {photo.image !== "" && (
                  <img
                    src={photo.image}
                    alt="uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )}
              </div>
              <div className={"text-light-h-2 space-y-3 flex flex-col"}>
                <div className={""}>
                  <p>Wie: {person}</p>
                  <p>Wanneer: {formatTime(photo.created_at)}</p>
                  <p>Waar: {address}</p>
                </div>
                <div className={""}>
                  <div className={"flex items-center mb-4 space-x-2"}>
                    <FontAwesomeIcon icon={faBriefcase} />
                    <p className={"font-bold"}>Opmerking</p>
                  </div>
                  <div
                    className={
                      "bg-light-bg-2 border-2 border-light-border rounded-lg p-2 overflow-y-auto text-light-h-1"
                    }
                  >
                    <p>{photo.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <CustomButton
            className={"bg-bad-1 text-dark-h-1 w-full"}
            onClick={closeModal}
            icon={faXmark}
          >
            Sluiten
          </CustomButton>
        </PrimaryCard>
      </Modal>
    </div>
  );
}
