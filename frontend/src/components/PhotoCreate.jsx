import PrimaryCard from "@/components/custom-card/PrimaryCard";
import "reactjs-popup/dist/index.css";
import PrimaryButton from "@/components/button/PrimaryButton";
import { useRef, useState } from "react";
import Image from "next/image";
import PhotoService from "@/services/photo.service";
import moment from "moment";
import ScheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import BuildingService from "@/services/building.service";
import BuildingInTourService from "@/services/buildingInTour.service";
import { getSession } from "next-auth/react";
import userService from "@/services/user.service";
import VisitService from "@/services/visit.service";

export default function PhotoCreation({
  scheduleUrl,
  state,
  buildingUrl,
  close,
}) {
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const CommentRef = useRef(null);

  function handlePhotoUpload(event) {
    const newPhotos = [...photos];
    const newFiles = [...files];
    for (let i = 0; i < event.target.files.length; i++) {
      newFiles.push(event.target.files[i]);
      newPhotos.push(URL.createObjectURL(event.target.files[i]));
    }
    setPhotos(newPhotos);
    setFiles(newFiles);
  }

  async function savePictures() {
    let comment = CommentRef.current.value;
    if (CommentRef.current.value === null || CommentRef.current.value === "") {
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
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("visit", visit.url);
        formData.append("state", state);
        formData.append("comment", comment);
        formData.append(
          "created_at",
          moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss")
        );
        const response = await PhotoService.postPhoto(formData);
        console.log(response);
        close();
      }
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
      console.log(buildingInTours);
      const response = await VisitService.postVisit({
        user: user.url,
        arrival: moment(new Date()).format("YYYY-MM-DD[T]HH:mm:ss"),
        comment: "",
        schedule: scheduleUrl,
      });
      console.log(user);
      close();
    }
  }

  return (
    <div className={"flex flex-col h-full w-full space-y-3"}>
      <div className={"h-[400px] w-full overflow-y-scroll rounded-lg border-2"}>
        {photos.map((photo) => (
          <Image
            src={photo}
            alt="uploaded"
            key={photo}
            width={500}
            height={500}
            layout="intrinsic"
            objectFit="cover"
            className={"w-full"}
          />
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
      />
      <textarea className={"border-2 rounded-lg"} ref={CommentRef} />
      <PrimaryButton onClick={savePictures}>Opslaan</PrimaryButton>
    </div>
  );
}
