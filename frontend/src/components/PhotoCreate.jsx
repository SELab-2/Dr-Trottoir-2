import "reactjs-popup/dist/index.css";
import PrimaryButton from "@/components/button/PrimaryButton";
import { useRef, useState } from "react";
import PhotoService from "@/services/photo.service";
import moment from "moment";
import ScheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import { getSession } from "next-auth/react";
import userService from "@/services/user.service";
import VisitService from "@/services/visit.service";
import React from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import CustomButton from "@/components/button/Button";
import { urlToPK } from "@/utils/urlToPK";
import {
  faArrowRotateRight,
  faCameraRetro,
  faCirclePlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import PrimaryCard from "@/components/custom-card/PrimaryCard";

/**
 * A popup to take a picture.
 * @param scheduleUrl The URL of a schedule object.
 * @param state The state of a picture (1: Arrival, 2: Departure, 3: Extra).
 * @param buildingUrl The URL of a building object.
 * @param callback A callback to give the new photo object.
 */
export default function PhotoCreation({
  scheduleUrl,
  state,
  buildingUrl,
  callback = () => {},
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [photoMode, setPhotoMode] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const CommentRef = useRef(null);

  function blobToUrl(blob) {
    // https://stackoverflow.com/questions/16968945/convert-base64-png-data-to-javascript-file-objects
    // The raw image is parsed into a file.
    let arr = blob.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], "capture.png", { type: mime });
    console.log(file);
    setFile(file);
    setPhoto(URL.createObjectURL(file));
  }

  /**
   * Makes a new Photo object
   * @param visit A visit object.
   * @param comment A comment from the user input.
   * @param date The current date of making the picture that is formatted correctly, so it can be parsed in the backend.
   */
  async function savePhoto(visit, comment, date) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("visit", visit.url);
    formData.append("state", state);
    formData.append("comment", comment);
    formData.append("created_at", date);
    const response = await PhotoService.postPhoto(formData);
    callback(response);
    setPhotoMode(true);
    closeModal();
  }

  async function savePictures() {
    let comment = CommentRef.current.value;
    if (CommentRef.current.value === null) {
      comment = "";
    }
    const visits = await ScheduleService.getVisitsFromSchedule(
      urlToPK(scheduleUrl)
    );
    const buildings = await Promise.all(
      visits.map(async (entry) => {
        const building = await BuildingInTourService.getEntryByUrl(
          entry["building_in_tour"]
        );
        return { building: building.building, visit: entry };
      })
    );
    const result = buildings.filter((b) => b.building === buildingUrl);
    console.log(result);
    // There already is a visit object
    if (result.length === 1) {
      const visit = result[0].visit;
      await savePhoto(
        visit,
        comment,
        moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
      );
    } else if (result.length === 0 && state === 1) {
      // The state is "arriving" and there is no visit object yet.
      // This means we have to make one first.
      let { user } = await getSession();
      let split = user.url.trim().split("/");
      user = await userService.getById(split[split.length - 2]);
      const schedule = await ScheduleService.getEntryByUrl(scheduleUrl);
      console.log(schedule);
      const buildingInTours = await TourService.getBuildingsFromTour(
        urlToPK(schedule.tour)
      );
      console.log(buildingInTours);
      const result = buildingInTours.filter(
        (entry) => entry.building === buildingUrl
      );
      console.log(result);
      const date = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss");
      const response = await VisitService.postVisit({
        user: user.url,
        arrival: date,
        comment: "",
        schedule: scheduleUrl,
        building_in_tour: result[0].url,
      });
      await savePhoto(response, comment, date);
      console.log(response);
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
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
        <PrimaryCard
          title={"Neem een foto"}
          icon={faCameraRetro}
          className={"w-full"}
        >
          {photoMode ? (
            <div className={"flex-col space-y-2"}>
              <Webcam
                audio={false}
                imageSmoothing
                screenshotFormat="image/png"
                screenshotQuality={1}
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "environment",
                }}
                className={"w-full"}
              >
                {({ getScreenshot }) => (
                  <div className={"flex flex-row"}>
                    <PrimaryButton
                      className={"w-full"}
                      onClick={() => {
                        const imageSrc = getScreenshot();
                        blobToUrl(imageSrc);
                        setPhotoMode(false);
                      }}
                      icon={faCameraRetro}
                    >
                      Neem foto
                    </PrimaryButton>
                  </div>
                )}
              </Webcam>
            </div>
          ) : (
            <div className={"flex flex-col space-y-2 h-full"}>
              <div className={"w-full rounded-lg border-2 overflow-hidden"}>
                <Image
                  src={photo}
                  alt="uploaded"
                  width={1280}
                  height={720}
                  layout="intrinsic"
                  objectFit="cover"
                  className={""}
                />
              </div>
              <div className={"w-full"}>
                <textarea
                  className={"border-2 rounded-lg w-full resize-none p-2"}
                  ref={CommentRef}
                />
                <div className={"flex flex-row"}>
                  <PrimaryButton
                    className={"w-full"}
                    icon={faCirclePlus}
                    onClick={savePictures}
                  >
                    Opslaan
                  </PrimaryButton>
                  <CustomButton
                    className={"bg-bad-1 text-dark-h-1"}
                    onClick={() => {
                      setPhotoMode(true);
                    }}
                    icon={faArrowRotateRight}
                  >
                    Opnieuw
                  </CustomButton>
                </div>
              </div>
            </div>
          )}
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
