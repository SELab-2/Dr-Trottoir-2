import Head from "next/head";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import LayoutDataAdd from "@/components/LayoutDataToevoegen";
import BuildingForm from "@/components/forms/BuildingForm";
import { useEffect, useState } from "react";
import BuildingService from "@/services/building.service";
import { urlToPK } from "@/utils/urlToPK";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import ScheduleService from "@/services/schedule.service";
import TourService from "@/services/tour.service";
import UserService from "@/services/user.service";
import TourForm from "@/components/forms/TourForm";
import ScheduleForm from "@/components/forms/ScheduleForm";
import StaffForm from "@/components/forms/StaffForm";
import SyndiciForm from "@/components/forms/SyndiciForm";

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
      <Link
        href={`/admin/data_toevoegen/gebouw/${id}`}
        key={data.url}
        className={""}
      >
        <div className={"text-light-h-1"}>
          <p> {data.nickname}</p>
          <p className={"truncate"}>
            {data.address_line_1 + data.address_line_2}
          </p>
        </div>
      </Link>
    );
  });
}

function personeelList(data) {
  return <p>TODO</p>;
}

function syndiciList(data) {
  return <p>TODO</p>;
}

export async function getStaticPaths() {
  const paths = [
    { params: { type: "planning" } },
    { params: { type: "rondes" } },
    { params: { type: "gebouwen" } },
    { params: { type: "personeel" } },
    { params: { type: "syndici" } },
  ];
  return {
    paths,
    fallback: false,
  };
}

// necessary for dynamic routes
export async function getStaticProps({ params }) {
  return {
    props: {},
  };
}

export default function AdminDataAddPage() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch all the data needed for the page
    async function fetchData() {
      switch (router.query.type) {
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
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Data toevoegen/bewerken:</title>
      </Head>
      <LayoutDataAdd>
        <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}>
          <div className={"flex flex-col space-y-4"}>
            {router.query.type === "planning" && scheduleList(data)}
            {router.query.type === "rondes" && tourList(data)}
            {router.query.type === "gebouwen" && buildingList(data)}
            {router.query.type === "personeel" && personeelList(data)}
            {router.query.type === "syndici" && syndiciList(data)}
          </div>
        </PrimaryCard>

        <PrimaryCard className={`h-full w-3/5`} title={"Bewerken"}>
          {router.query.type === "planning" && <ScheduleForm />}
          {router.query.type === "rondes" && <TourForm />}
          {router.query.type === "gebouwen" && <BuildingForm />}
          {router.query.type === "personeel" && <StaffForm />}
          {router.query.type === "syndici" && <SyndiciForm />}
        </PrimaryCard>
      </LayoutDataAdd>
    </>
  );
}

AdminDataAddPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
