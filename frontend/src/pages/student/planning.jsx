import Layout from "@/components/Layout";
import MobileLayout from "@/components/MobileLayout";
import Popup from "reactjs-popup";
import PhotoCreation from "@/components/PhotoCreate";

export default function StudentPlanningPage() {
  // TODO: Implement this page
  return (
    <>
      <div>
        <p>placehoder</p>
        <Popup
          trigger={<button> Click to open popup </button>}
          position="right center"
          modal
        >
          {(close) => (
            <PhotoCreation
              scheduleUrl={"http://localhost:8000/api/schedule/1/"}
              state={1}
              close={close}
              buildingUrl={"http://127.0.0.1:8000/api/building/3/"}
            />
          )}
        </Popup>
      </div>
    </>
  );
}

StudentPlanningPage.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
