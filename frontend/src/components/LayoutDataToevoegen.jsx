import PrimaryCard from "@/components/custom-card/PrimaryCard";
import LinkList from "@/components/navbar/LinkList";
import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faCalendarWeek,
  faLocationDot,
  faPeopleGroup,
  faPlusCircle,
  faTrash,
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
import RegionService from "@/services/region.service";
import moment from "moment";
import scheduleService from "@/services/schedule.service";
import CustomWeekPicker from "./input-fields/CustomWeekPicker";

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

function regionList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);

    return (
      <LinkButton
        key={id}
        link={`/admin/data_toevoegen/regio/${id}`}
        className={"truncate"}
      >
        <div className={"text-light-h-1"}>
          <p>{data.region_name}</p>
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

export default function LayoutDataAdd({ children, id }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().startOf("isoWeek").toDate(),
    moment().endOf("isoWeek").toDate(),
  ]);
  // used to change the daterange of weekpicker to selected schedule
  const [directToId, setDirectToId] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      switch (router.query.type) {
        case "planningen": {
          if (id != null && directToId) {
            let schedule = await scheduleService.getById(id);
            setDirectToId(false);
            setDateRange([
              moment(schedule.date).startOf("isoWeek").toDate(),
              moment(schedule.date).endOf("isoWeek").toDate(),
            ]);
          }
          let data = await ScheduleService.get({
            startDate: dateRange[0],
            endDate: dateRange[1],
          });
          data = await Promise.all(
            data.map(async (entry) => {
              entry.student = await UserService.getEntryByUrl(entry.student);
              return entry;
            })
          );
          data = data.sort(function (a, b) {
            return b.date.localeCompare(a.date);
          });
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
          setData(await RegionService.get());
          break;
        default:
          setData([]);
      }
    }

    fetchData()
      .then(() => setLoading(false))
      .catch((err) => alert(err));
  }, [router.query.type, dateRange]);

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
              Afval: {
                icon: faTrash,
                link: "/admin/data_toevoegen/afval",
              },
              Rondes: {
                icon: faBicycle,
                link: "/admin/data_toevoegen/rondes",
              },
              Regio: {
                icon: faLocationDot,
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

      {router.query.type !== "afval" && (
        <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}>
          {loading ? (
            <div className={"flex justify-center items-center h-fit w-full"}>
              <Loading className={"w-10 h-10"} />
            </div>
          ) : (
            <div className={"flex flex-col space-y-4"}>
              {router.query.type === "planningen" && (
                <div>
                  <CustomWeekPicker
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={(begin, end) => setDateRange([begin, end])}
                    className={"mb-2"}
                  />
                  {scheduleList(data)}
                </div>
              )}
              {router.query.type === "rondes" && tourList(data)}
              {router.query.type === "regio" && regionList(data)}
              {router.query.type === "gebouwen" && buildingList(data)}
              {router.query.type === "personeel" && personeelList(data)}
              {router.query.type === "syndici" && syndiciList(data)}
            </div>
          )}
        </PrimaryCard>
      )}

      <PrimaryCard
        className={`h-full ${
          router.query.type === "afval" ? "w-full" : "w-3/5"
        }`}
        title={"Bewerken"}
      >
        {children}
      </PrimaryCard>
    </div>
  );
}
