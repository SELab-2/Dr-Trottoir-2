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
      setPhoto(photo.image);
    };
    loadPhoto().catch();
  }, []);

  return (
    <>
      <div>
        <p>placehoder</p>
        <Popup
          trigger={<button> Click to open popup </button>}
          position="center center"
          modal
        >
          {(close) => (
            <PhotoCreation
              scheduleUrl={"http://localhost:8000/api/schedule/1/"}
              state={1}
              close={close}
              buildingUrl={"http://localhost:8000/api/building/3/"}
            />
          )}
        </Popup>
        <Popup
          trigger={<button> Click to open popup </button>}
          position="center center"
          modal
        >
          {(close) => <PhotoPage photo={photo} />}
        </Popup>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
