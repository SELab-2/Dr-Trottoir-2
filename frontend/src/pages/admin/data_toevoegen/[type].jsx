import Head from "next/head";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import LayoutDataAdd from "@/components/LayoutDataToevoegen";
import BuildingForm from "@/components/forms/BuildingForm";
import { useEffect, useState } from "react";
import BuildingService from "@/services/building.service";

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
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const d = await BuildingService.getAll();
      setBuildings(d);
      console.log(d);
    };
    fetchData().catch();
    console.log(buildings);
  }, [buildings]);

  return (
    <>
      <Head>
        <title>Data toevoegen/bewerken:</title>
      </Head>
      <LayoutDataAdd>
        <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}>
          <ul>
            {buildings.map((building) => {
              return <p key={building.url}>{building.nickname}</p>;
            })}
          </ul>
        </PrimaryCard>

        <PrimaryCard className={`h-full w-3/5`} title={"Bewerken"}>
          <BuildingForm />
        </PrimaryCard>
      </LayoutDataAdd>
    </>
  );
}
