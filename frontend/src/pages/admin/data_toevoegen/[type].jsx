import Head from "next/head";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import CustomButton from "@/components/button/Button";
import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faCalendarWeek,
  faPeopleGroup,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import LinkList from "@/components/navbar/LinkList";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

export async function getStaticProps({ params }) {
  return {
    props: {},
  };
}

export default function AdminDataAddPage() {
  // TODO: Implement this page
  return (
    <>
      <Head>
        <title>Data toevoegen/bewerken:</title>
      </Head>
      <div className={"flex flex-row h-full w-full p-2 space-x-2"}>
        <div className={`w-1/5 space-y-2`}>
          <PrimaryCard title={"Data types"}>

            <LinkList
              categories={{
                Planning: {
                  icon: faCalendarWeek,
                  link: "/admin/data_toevoegen/planning",
                },
                Rondes: {
                  icon: faBicycle,
                  link: "/admin/data_toevoegen/rondes",
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
          <PrimaryButton icon={faPlusCircle} className={"w-full"}>
            Nieuw Item
          </PrimaryButton>
          <SecondaryButton icon={faPlusCircle} className={"w-full"}>
            Kopieer Item
          </SecondaryButton>
        </div>
        <PrimaryCard className={`h-full w-1/5`} title={"Huidige"}></PrimaryCard>

        <PrimaryCard
          className={`h-full w-3/5`}
          title={"Bewerken"}
        ></PrimaryCard>
      </div>
    </>
  );
}
