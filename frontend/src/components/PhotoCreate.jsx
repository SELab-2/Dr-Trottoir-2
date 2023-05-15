import "reactjs-popup/dist/index.css";
import PrimaryButton from "@/components/button/PrimaryButton";
import { useEffect, useRef, useState } from "react";
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
import PhotoScreen from "@/components/CameraScreen";
import Popup from "reactjs-popup";
import CustomButton from "@/components/button/Button";

export default function PhotoCreation({
  scheduleUrl,
  state,
  buildingUrl,
  close,
}) {
  const [photoMode, setPhotoMode] = useState(true);
  const [commentMode, setCommentMode] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const CommentRef = useRef(null);

  useEffect(() => {
    setPhotoMode(true);
    setPhotoMode(true);
  }, []);
  console.log(photoMode);

  function blobToUrl(blob) {
    // https://stackoverflow.com/questions/16968945/convert-base64-png-data-to-javascript-file-objects
    let arr = blob.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], "test.png", { type: mime });
    console.log(file);
    setFile(file);
    setPhoto(URL.createObjectURL(file));
    //handlePhotoUpload([file]);
  }

  function handlePhotoUpload(file) {
    const newFiles = [...files];
    const newPhotos = [...photos];
    for (let i = 0; i < files.length; i++) {
      console.log(files[i]);
      newFiles.push(files[i]);
      newPhotos.push(URL.createObjectURL(files[i]));
    }
    setPhotos(newPhotos);
    setFiles(newFiles);
  }

  async function savePhoto(visit, comment, date) {
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("visit", visit.url);
      formData.append("state", state);
      formData.append("comment", comment);
      formData.append("created_at", date);
      const response = await PhotoService.postPhoto(formData);
      console.log(response);
      close();
    }
  }

  async function savePictures() {
    if (photos.length > 0) {
      let comment = CommentRef.current.value;
      if (
        CommentRef.current.value === null ||
        CommentRef.current.value === ""
      ) {
        comment = "<Geen commentaar>";
      }

      let split = scheduleUrl.trim().split("/");
      const visits = await ScheduleService.getVisitsFromSchedule(
        split[split.length - 2]
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
      if (result.length === 1 && state !== 1) {
        const visit = result[0].visit;
        await savePhoto(
          visit,
          comment,
          moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
        );
      } else if (result.length === 0 && state === 1) {
        let { user } = await getSession();
        let split = user.url.trim().split("/");
        user = await userService.getById(split[split.length - 2]);
        const schedule = await ScheduleService.getEntryByUrl(scheduleUrl);
        split = schedule.tour.trim().split("/");
        const buildingInTours = await TourService.getBuildingsFromTour(
          split[split.length - 2]
        );
        const result = buildingInTours.filter(
          (entry) => entry.building === buildingUrl
        );
        const date = moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss");
        const response = await VisitService.postVisit({
          user: user.url,
          arrival: date,
          comment: "",
          schedule: scheduleUrl,
          building_in_tour: result[0].url,
        });
        await savePhoto(response.url, comment, date);
        console.log(response);
      }
    }
  }

  return photoMode ? (
    <div className={"flex-col space-y-2"}>
      <Webcam
        audio={false}
        height={720}
        screenshotFormat="image/png"
        width={1280}
        screenshotQuality={1}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "environment",
        }}
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
            >
              Capture photo
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
          height={600}
          layout="intrinsic"
          objectFit="cover"
          className={"h-4/5"}
        />
      </div>
      <div className={"w-full"}>
        <textarea
          className={"border-2 rounded-lg w-full resize-none"}
          ref={CommentRef}
        />
        <div className={"flex flex-row"}>
          <PrimaryButton className={"w-full"} onClick={savePictures}>
            Opslaan
          </PrimaryButton>
          <CustomButton
            className={"bg-bad-1 text-dark-h-1"}
            onClick={() => {
              setPhotoMode(true);
            }}
          >
            Retry
          </CustomButton>
        </div>
      </div>
    </div>

    // <div className={"flex flex-col h-full w-full space-y-4"}>
    //   <div className={"h-full w-full overflow-y-scroll space-y-2"}>
    //     {photos.map((photo) => (
    //       <div
    //         key={photo}
    //         className={"w-full rounded-lg border-2 overflow-hidden"}
    //       >
    //         <Image
    //           src={photo}
    //           alt="uploaded"
    //           width={500}
    //           height={500}
    //           layout="intrinsic"
    //           objectFit="cover"
    //         />
    //       </div>
    //     ))}
    //   </div>
    //   <input
    //     type="file"
    //     accept="image/*"
    //     multiple
    //     className={"py-4"}
    //     onChange={(event) => handlePhotoUpload(event.target.files)}
    //   />
    //   <textarea
    //     className={"border-2 rounded-lg h-[300px] resize-none"}
    //     ref={CommentRef}
    //   />
    //   <PrimaryButton onClick={savePictures}>Opslaan</PrimaryButton>
    // </div>
  );
}
