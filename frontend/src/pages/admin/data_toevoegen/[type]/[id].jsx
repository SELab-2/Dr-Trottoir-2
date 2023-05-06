import { useRouter } from "next/router";
import Head from "next/head";
import ScheduleForm from "@/components/forms/ScheduleForm";
import TourForm from "@/components/forms/TourForm";
import BuildingForm from "@/components/forms/BuildingForm";
import StaffForm from "@/components/forms/StaffForm";
import SyndiciForm from "@/components/forms/SyndiciForm";
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

      <LayoutDataAdd route={router.query.type}>
        {router.query.type === "planningen" && <ScheduleForm />}
        {router.query.type === "rondes" && <TourForm id={router.query.id} />}
        {router.query.type === "rondes" && <RegionForm id={router.query.id} />}
        {router.query.type === "gebouwen" && (
          <BuildingForm id={router.query.id} />
        )}
        {router.query.type === "personeel" && <StaffForm />}
        {router.query.type === "syndici" && <SyndiciForm />}
      </LayoutDataAdd>
    </>
  );
}

AdminDataUpdatePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
