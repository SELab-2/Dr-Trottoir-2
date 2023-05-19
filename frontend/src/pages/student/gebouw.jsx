import MobileLayout from "@/components/MobileLayout";
import { useEffect, useState } from "react";
import faBuilding from "@fortawesome/free-solid-svg-icons";
import Dropdown from "@/components/Dropdown";
import scheduleService from "@/services/schedule.service";
import { urlToPK } from "@/utils/urlToPK";
import moment from "moment";
import { getSession } from "next-auth/react";
import userService from "@/services/user.service";
import tourService from "@/services/tour.service";
import { useRouter } from "next/router";

export default function StudentBuilding() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      let { user } = await getSession();
      const userId = urlToPK(user.url);
      user = await userService.getById(userId);

      const schedules = await scheduleService.get({
        startDate: moment().startOf("day").toDate(),
        endDate: moment().endOf("day").toDate(),
        students: [user.url],
      });

      let scheduledBuildings = [];
      for (let i in schedules) {
        let schedule = schedules[i];
        let buildingsInTour = await tourService.getBuildingsFromTour(
          urlToPK(schedule.tour)
        );
        scheduledBuildings = scheduledBuildings.concat(
          buildingsInTour.map((buildingInTour) => ({
            url: buildingInTour.building,
            nickname: buildingInTour.building_data.nickname,
            schedule: schedule.url,
          }))
        );
      }
      setBuildings(scheduledBuildings);
    }
    fetchData();
  }, []);

  async function changeBuilding(selected) {
    if (selected.length !== 0) {
      const nicknameSelected = selected[0];
      let building = buildings.find(
        (building) => building.nickname === nicknameSelected
      );
      setSelectedBuilding(building);
      router.push(`/student/gebouw/${urlToPK(building.url)}`);
    } else {
      setSelectedBuilding(null);
    }
  }

  return (
    <>
      <div className="w-full p-2">
        <Dropdown
          icon={faBuilding}
          options={buildings.map((building) => building.nickname)}
          onClick={changeBuilding}
        >
          {selectedBuilding == null ? (
            <div>Selecteer een gebouw</div>
          ) : (
            <div>{selectedBuilding.nickname}</div>
          )}
        </Dropdown>
      </div>
    </>
  );
}

StudentBuilding.getLayout = function getLayout(page) {
  return <MobileLayout>{page}</MobileLayout>;
};
