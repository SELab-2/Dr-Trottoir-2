import { useRouter } from "next/router";
import Head from "next/head";
import ScheduleForm from "@/components/forms/ScheduleForm";
import TourForm from "@/components/forms/TourForm";
import BuildingForm from "@/components/forms/BuildingForm";
import UserForm from "@/components/forms/UserForm";
import Layout from "@/components/Layout";
import LayoutDataAdd from "@/components/LayoutDataToevoegen";
import RegionForm from "@/components/forms/RegionForm";

export default function AdminDataUpdatePage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Data toevoegen/bewerken:</title>
      </Head>

      <LayoutDataAdd route={router.query.type} id={router.query.id}>
        {router.query.type === "planningen" && (
          <ScheduleForm id={router.query.id} />
        )}
        {router.query.type === "rondes" && <TourForm id={router.query.id} />}
        {router.query.type === "regio" && <RegionForm id={router.query.id} />}
        {router.query.type === "gebouwen" && (
          <BuildingForm id={router.query.id} />
        )}
        {router.query.type === "personeel" && <UserForm id={router.query.id} />}
        {router.query.type === "syndici" && <UserForm id={router.query.id} />}
      </LayoutDataAdd>
    </>
  );
}

AdminDataUpdatePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
