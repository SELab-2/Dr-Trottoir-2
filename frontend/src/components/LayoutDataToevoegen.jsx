import PrimaryCard from "@/components/custom-card/PrimaryCard";
import InputField from "@/components/input-fields/InputField";
import LinkList from "@/components/navbar/LinkList";
import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faCalendarWeek,
  faLocationDot,
  faPeopleGroup,
  faPlusCircle,
  faSearch,
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
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import TourCopyModal from "@/components/forms/forms-copy-modal/TourCopyModal";
import ScheduleCopyModal from "@/components/forms/forms-copy-modal/ScheduleCopyModal";
import RegionCopyModal from "@/components/forms/forms-copy-modal/RegionCopyModal";
import BuildingCopyModal from "@/components/forms/forms-copy-modal/BuildingCopyModal";
import ColoredTag from "@/components/Tag";

function scheduleList(data) {
  return data.map((data) => {
    const id = urlToPK(data.url);
    return (
      <LinkButton
        key={id}
        link={`/beheer/data_toevoegen/planningen/${id}`}
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
  data = data.filter((tour) => {
    return !data.some((tour2) => {
      return tour.name === tour2.name && urlToPK(tour.url) < urlToPK(tour2.url);
    });
  });

  return data.map((data) => {
    const id = urlToPK(data.url);

    return (
      <LinkButton
        key={id}
        link={`/beheer/data_toevoegen/rondes/${id}`}
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
        link={`/beheer/data_toevoegen/regio/${id}`}
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
        link={`/beheer/data_toevoegen/gebouwen/${id}`}
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

function userList(data, type) {
  return data
    .filter((user) => !user.removed)
    .map((data) => {
      return (
        <LinkButton
          key={data.url}
          link={`/beheer/data_toevoegen/${type}/${urlToPK(data.url)}`}
          className={"truncate"}
        >
          <div className={"text-light-h-1"}>
            <div className={"flex flex-row items-center"}>
              <p className={"flex-grow"}>
                {data.first_name + " " + data.last_name}
              </p>
              <ColoredTag
                className={`${
                  data.active ? "text-good-1 bg-good-2" : "text-bad-1 bg-bad-2"
                }`}
              >
                {data.active ? "Actief" : "Inactief"}
              </ColoredTag>
            </div>
            <p className={"text-light-h-2"}>{data.email}</p>
          </div>
        </LinkButton>
      );
    });
}

export default function LayoutDataAdd({ children }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    // fetch all the data needed for the page
    async function fetchData() {
      switch (router.query.type) {
        case "planningen": {
          let scheduleData = await ScheduleService.get();
          const studentUrls = [
            ...new Set(scheduleData.map((schedule) => schedule.student)),
          ];
          let studentsData = {};
          await Promise.all(
            studentUrls.map(async (url) => {
              studentsData[url] = await UserService.getEntryByUrl(url);
            })
          );
          const scheduleDataWithUsers = scheduleData.map((schedule) => {
            schedule.student = studentsData[schedule.student];
            return schedule;
          });
          setData(scheduleDataWithUsers);
          break;
        }
        case "rondes":
          setData(await TourService.get());
          break;
        case "gebouwen":
          setData(await BuildingService.get());
          break;
        case "personeel":
          setData(await UserService.get({ roles: [1, 2, 3, 5] }));
          break;
        case "syndici":
          setData(await UserService.get({ roles: [4] }));
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
  }, [router.query.type]);

  return (
    <div className={"m-2 h-screen"}>
      {router.query.type === "planningen" && (
        <ScheduleCopyModal
          open={modalOpen}
          onCloseModal={() => setModalOpen(false)}
        />
      )}
      {router.query.type === "rondes" && (
        <TourCopyModal
          open={modalOpen}
          onCloseModal={() => setModalOpen(false)}
        />
      )}
      {router.query.type === "regio" && (
        <RegionCopyModal
          open={modalOpen}
          onCloseModal={() => setModalOpen(false)}
        />
      )}
      {router.query.type === "gebouwen" && (
        <BuildingCopyModal
          open={modalOpen}
          onCloseModal={() => setModalOpen(false)}
        />
      )}
      <PrimaryCard title={"Selecteer type"} className={""}>
        <SecondaryCard>
          <LinkList
            className={"xl:flex flex-wrap justify-between items-center"}
            categories={{
              Planningen: {
                icon: faCalendarWeek,
                link: "/beheer/data_toevoegen/planningen",
              },
              Rondes: {
                icon: faBicycle,
                link: "/beheer/data_toevoegen/rondes",
              },
              Regio: {
                icon: faLocationDot,
                link: "/beheer/data_toevoegen/regio",
              },
              Gebouwen: {
                icon: faBuilding,
                link: "/beheer/data_toevoegen/gebouwen",
              },
              Personeel: {
                icon: faPeopleGroup,
                link: "/beheer/data_toevoegen/personeel",
              },
              Syndici: {
                icon: faBriefcase,
                link: "/beheer/data_toevoegen/syndici",
              },
            }}
            linkClassName={"hover: hover:bg-light-bg-2"}
          />
        </SecondaryCard>
      </PrimaryCard>
      <PrimaryCard className={"mt-2"}>
        <div className={"flex justify-between mb-4"}>
          <div className={"flex w-2/6"}>
            <InputField
              classNameDiv={"w-full"}
              reference={() => {}}
              icon={faSearch}
              actionCallback={() => {}}
            />
          </div>
          <div>
            <SecondaryButton
              icon={faPlusCircle}
              className={"w-48"}
              text={"Sort"}
            >
              Bulk Acties
            </SecondaryButton>
            {router.query.id &&
              router.query.type !== "personeel" &&
              router.query.type !== "syndici" && (
                <SecondaryButton
                  icon={faPlusCircle}
                  className={"w-36"}
                  text={"Sort"}
                  onClick={() => setModalOpen(true)}
                >
                  Kopieer
                </SecondaryButton>
              )}
            <PrimaryButton
              icon={faPlusCircle}
              className={"w-36"}
              onClick={() =>
                router.push(`/beheer/data_toevoegen/${router.query.type}`)
              }
            >
              Nieuw
            </PrimaryButton>
          </div>
        </div>
        <SecondaryCard
          className={"flex flex-row h-full w-full p-2 space-x-4 h-screen"}
        >
          <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}>
            {loading ? (
              <div className={"flex justify-center items-center h-fit w-full"}>
                <Loading className={"w-10 h-10"} />
              </div>
            ) : data.length !== 0 ? (
              <div className={"flex flex-col space-y-4"}>
                {router.query.type === "planningen" && scheduleList(data)}
                {router.query.type === "rondes" && tourList(data)}
                {router.query.type === "regio" && regionList(data)}
                {router.query.type === "gebouwen" && buildingList(data)}
                {router.query.type === "personeel" &&
                  userList(data, "personeel")}
                {router.query.type === "syndici" && userList(data, "syndici")}
              </div>
            ) : (
              <div className={"flex justify-center items-center"}>
                <p> Geen {router.query.type} </p>
              </div>
            )}
          </PrimaryCard>

          <PrimaryCard
            className={`h-full w-4/5`}
            title={router.query.id ? "Bewerken" : "Toevoegen"}
          >
            {children}
          </PrimaryCard>
        </SecondaryCard>
      </PrimaryCard>
    </div>
  );
}
