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
import { useRouter } from "next/router";
import LinkButton from "@/components/navbar/LinkButton";
import Loading from "@/components/Loading";

function scheduleList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);
    return (
      <LinkButton
        key={id}
        link={`/admin/data_toevoegen/planningen/${id}`}
        className={"truncate"}
      >
        <div className={"text-light-h-1"}>
          <p>{data.date}</p>
          {data.student && (
            <p className={"text-light-h-2"}>
              {data.student.first_name + " " + data.student.last_name}
            </p>
          )}
        </div>
      </LinkButton>
    );
  });
}

function tourList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);

    return (
      <LinkButton
        key={id}
        link={`/admin/data_toevoegen/rondes/${id}`}
        className={"truncate"}
      >
        <div className={"text-light-h-1"}>
          <p>{data.name}</p>
          <p className={"text-light-h-2"}>{data.region_name}</p>
        </div>
      </LinkButton>
    );
  });
}

function regioList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);

    return (
      <LinkButton
        key={id}
        link={`/admin/data_toevoegen/rondes/${id}`}
        className={"truncate"}
      >
        <div className={"text-light-h-1"}>
          <p>text</p>
        </div>
      </LinkButton>
    );
  });
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
          <p className={"text-light-h-2"}>
            {data.address_line_1 + " " + data.address_line_2}
          </p>
        </div>
      </LinkButton>
    );
  });
}

function personeelList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);

    if (data.role !== 4) {
      return (
        <LinkButton
          key={id}
          link={`/admin/data_toevoegen/personeel/${id}`}
          className={"truncate"}
        >
          <div className={"text-light-h-1"}>
            <p>{data.first_name + " " + data.last_name}</p>
            <p className={"text-light-h-2"}>{data.email}</p>
            <p></p>
          </div>
        </LinkButton>
      );
    }
  });
}

function syndiciList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);

    if (data.role === 4) {
      return (
        <LinkButton
          key={id}
          link={`/admin/data_toevoegen/syndici/${id}`}
          className={"truncate"}
        >
          <div className={"text-light-h-1"}>
            <p>{data.first_name + " " + data.last_name}</p>
            <p className={"text-light-h-2"}>{data.email}</p>
          </div>
        </LinkButton>
      );
    }
  });
}

export default function LayoutDataAdd({ children }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      switch (router.query.type) {
        case "planningen": {
          let data = await ScheduleService.get();
          data = await Promise.all(
            data.map(async (entry) => {
              entry.student = await UserService.getEntryByUrl(entry.student);
              return entry;
            })
          );
          setData(data);
          break;
        }
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
        case "regio":
          setData([]);
          break;
        default:
          setData([]);
      }
    }

    fetchData()
      .then(() => setLoading(false))
      .catch((err) => alert(err));
  }, [router.query.type]);

  return (
    <div className={"flex flex-row h-full w-full p-2 space-x-2"}>
      <div className={`w-1/5 space-y-2`}>
        <PrimaryCard title={"Data types"}>
          <LinkList
            categories={{
              Planningen: {
                icon: faCalendarWeek,
                link: "/admin/data_toevoegen/planningen",
              },
              Rondes: {
                icon: faBicycle,
                link: "/admin/data_toevoegen/rondes",
              },
              Regio: {
                icon: faBicycle,
                link: "/admin/data_toevoegen/regio",
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
        <PrimaryButton
          icon={faPlusCircle}
          className={"w-full"}
          onClick={() =>
            router.push(`/admin/data_toevoegen/${router.query.type}`)
          }
        >
          Nieuw Item
        </PrimaryButton>
        <SecondaryButton icon={faPlusCircle} className={"w-full"}>
          Kopieer Item
        </SecondaryButton>
      </div>

      <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}>
        {loading ? (
          <div className={"flex justify-center items-center h-fit w-full"}>
            <Loading className={"w-10 h-10"} />
          </div>
        ) : (
          <div className={"flex flex-col space-y-4"}>
            {router.query.type === "planningen" && scheduleList(data)}
            {router.query.type === "rondes" && tourList(data)}
            {router.query.type === "regio" && regioList(data)}
            {router.query.type === "gebouwen" && buildingList(data)}
            {router.query.type === "personeel" && personeelList(data)}
            {router.query.type === "syndici" && syndiciList(data)}
          </div>
        )}
      </PrimaryCard>

      <PrimaryCard className={`h-full w-3/5`} title={"Bewerken"}>
        {children}
      </PrimaryCard>
    </div>
  );
}
