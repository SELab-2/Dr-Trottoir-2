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
import NavbarList from "@/components/navbar/NavbarList";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            <div className={"flex flex-col"}>
              <Link href={"#"}>Planning</Link>
              <Link href={"#"}>Rondes</Link>
              <Link href={"#"}>Gebouwen</Link>
              <Link href={"#"}>Personeel</Link>
              <Link href={"#"}>Syndici</Link>
            </div>
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
