import Layout from "@/components/Layout";
import MobileLayout from "@/components/MobileLayout";
import Popup from "reactjs-popup";
import PhotoCreation from "@/components/PhotoCreate";
import PhotoPage from "@/components/PhotoPage";
import { useEffect, useState } from "react";
import PhotoService from "@/services/photo.service";

export default function StudentPlanningPage() {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const photo = await PhotoService.getById(1);
      const split = photo.image.split("/");

      console.log(split[split.length - 1]);
      setPhoto(photo);
    };
    loadPhoto().catch();
  }, []);

  return (
    <>
      <div>
        <p>placehoder</p>
        <PhotoCreation
          scheduleUrl={"http://localhost:8000/api/schedule/1/"}
          state={1}
          buildingUrl={"http://localhost:8000/api/building/3/"}
        />
        <PhotoPage photo={photo} />
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
