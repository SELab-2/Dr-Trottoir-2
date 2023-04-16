import Head from "next/head";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import LayoutDataAdd from "@/components/LayoutDataToevoegen";

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
  return (
    <>
      <Head>
        <title>Data toevoegen/bewerken:</title>
      </Head>
      <LayoutDataAdd>
        <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}></PrimaryCard>

        <PrimaryCard
          className={`h-full w-3/5`}
          title={"Bewerken"}
        ></PrimaryCard>
      </LayoutDataAdd>
    </>
  );
}
