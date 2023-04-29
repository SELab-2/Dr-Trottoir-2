import Head from "next/head";
import BuildingForm from "@/components/forms/BuildingForm";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import TourForm from "@/components/forms/TourForm";
import ScheduleForm from "@/components/forms/ScheduleForm";
import StaffForm from "@/components/forms/StaffForm";
import SyndiciForm from "@/components/forms/SyndiciForm";
import LayoutDataAdd from "@/components/LayoutDataToevoegen";

export async function getStaticPaths() {
  const paths = [
    { params: { type: "planningen" } },
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

  return (
    <>
      <Head>
        <title>Data toevoegen/bewerken:</title>
      </Head>

      <LayoutDataAdd route={router.query.type}>
        {router.query.type === "planningen" && <ScheduleForm />}
        {router.query.type === "rondes" && <TourForm />}
        {router.query.type === "gebouwen" && <BuildingForm />}
        {router.query.type === "personeel" && <StaffForm />}
        {router.query.type === "syndici" && <SyndiciForm />}
      </LayoutDataAdd>
    </>
  );
}

AdminDataAddPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
