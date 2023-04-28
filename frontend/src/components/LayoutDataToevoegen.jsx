import PrimaryCard from "@/components/custom-card/PrimaryCard";
import LinkList from "@/components/navbar/LinkList";
import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faCalendarWeek,
  faPeopleGroup,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import { useEffect, useState } from "react";
import ScheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import BuildingService from "@/services/building.service";
import UserService from "@/services/user.service";
import { urlToPK } from "@/utils/urlToPK";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkButton from "@/components/navbar/LinkButton";

function scheduleList(data) {
  return <p>TODO</p>;
}

function tourList(data) {
  return <p>TODO</p>;
}

function buildingList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);

    return (
      <LinkButton
        key={id}
        link={`/admin/data_toevoegen/gebouwen/${id}`}
        className={"truncate"}
      >
        <div className={"text-light-h-1"}>
          <p> {data.nickname}</p>
          <p className={"truncate"}>
            {data.address_line_1 + data.address_line_2}
          </p>
        </div>
      </LinkButton>
    );
  });
}

function personeelList(data) {
  return <p>TODO</p>;
}

function syndiciList(data) {
  return <p>TODO</p>;
}

export default function LayoutDataAdd({ children, route }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      console.log(route);
      switch (route) {
        case "planning":
          setData(await ScheduleService.get());
          break;
        case "rondes":
          setData(await TourService.get());
          break;
        case "gebouwen":
          setData(await BuildingService.get());
          break;
        case "personeel":
          setData(await UserService.get());
          break;
        case "syndici":
          setData(await UserService.get());
          break;
        default:
          setData([]);
      }
    }

    fetchData().catch();
  }, [route]);

  return (
    <div className={"flex flex-row h-full w-full p-2 space-x-2"}>
      <div className={`w-1/5 space-y-2`}>
        <PrimaryCard title={"Data types"}>
          <LinkList
            categories={{
              Planning: {
                icon: faCalendarWeek,
                link: "/admin/data_toevoegen/planning",
              },
              Rondes: {
                icon: faBicycle,
                link: "/admin/data_toevoegen/rondes",
              },
              Gebouwen: {
                icon: faBuilding,
                link: "/admin/data_toevoegen/gebouwen",
              },
              Personeel: {
                icon: faPeopleGroup,
                link: "/admin/data_toevoegen/personeel",
              },
              Syndici: {
                icon: faBriefcase,
                link: "/admin/data_toevoegen/syndici",
              },
            }}
            linkClassName={"hover: hover:bg-light-bg-2"}
          />
        </PrimaryCard>
        <PrimaryButton icon={faPlusCircle} className={"w-full"}>
          Nieuw Item
        </PrimaryButton>
        <SecondaryButton icon={faPlusCircle} className={"w-full"}>
          Kopieer Item
        </SecondaryButton>
      </div>

      <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}>
        <div className={"flex flex-col space-y-4"}>
          {route === "planning" && scheduleList(data)}
          {route === "rondes" && tourList(data)}
          {route === "gebouwen" && buildingList(data)}
          {route === "personeel" && personeelList(data)}
          {route === "syndici" && syndiciList(data)}
        </div>
      </PrimaryCard>

      <PrimaryCard className={`h-full w-3/5`} title={"Bewerken"}>
        {children}
      </PrimaryCard>
    </div>
  );
}
