import Head from "next/head";
import BuildingForm from "@/components/forms/BuildingForm";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import TourForm from "@/components/forms/TourForm";
import ScheduleForm from "@/components/forms/ScheduleForm";
import UserForm from "@/components/forms/UserForm";
import LayoutDataAdd from "@/components/LayoutDataToevoegen";
import RegionForm from "@/components/forms/RegionForm";

export async function getStaticPaths() {
  const paths = [
    { params: { type: "planningen" } },
    { params: { type: "rondes" } },
    { params: { type: "regio" } },
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
        {router.query.type === "regio" && <RegionForm />}
        {router.query.type === "gebouwen" && <BuildingForm />}
        {router.query.type === "personeel" && <UserForm />}
        {router.query.type === "syndici" && <UserForm />}
      </LayoutDataAdd>
    </>
  );
}

AdminDataAddPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
