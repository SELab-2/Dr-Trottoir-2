import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faEnvelopeOpenText,
  faPeopleGroup,
  faCalendarWeek,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LinkList from "@/components/navbar/LinkList";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfilePicture from "@/components/ProfilePicture";
import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png";

// https://flowbite.com/docs/components/sidebar/
export default function Navbar() {
  const {
    data: { user },
  } = useSession();
  return (
    <div className={"flex flex-col flex-shrink-0 sm:w-64 h-full bg-dark-bg-1"}>
      <div className={"flex justify-center p-1 mb-2 mt-8"}>
        <Link href={"/"}>
          <Image src={Logo} className="w-36 object-fill" alt="logo" />
        </Link>
      </div>
      <div
        className={
          "overflow-y-auto overflow-x-hidden flex-grow border-b border-none p-3"
        }
      >
        <LinkList
          name={"Menu"}
          categories={{
            Dashboard: { icon: faCalendarWeek, link: "/beheer/dashboard" },
            "Databeheer": {
              icon: faCirclePlus,
              link: "/beheer/data_toevoegen",
            },
          }}
          className={"text-dark-text bg-dark-bg-1 mt-6 mb-6"}
          linkClassName={"hover: hover:bg-dark-bg-2"}
        />
        <LinkList
          name={"Data"}
          categories={{
            Planningen: { icon: faBicycle, link: "/beheer/planningen/1" },
            Gebouwen: { icon: faBuilding, link: "/beheer/gebouwen" },
            Personeel: { icon: faPeopleGroup, link: "/beheer/personeel" },
            Syndici: { icon: faBriefcase, link: "/beheer/syndici" },
          }}
          className={"text-dark-text bg-dark-bg-1 mt-6 mb-6 "}
          linkClassName={"hover: hover:bg-dark-bg-2"}
        />
        <LinkList
          name={"Communicatie"}
          categories={{
            Templates: { icon: faEnvelopeOpenText, link: "#" },
          }}
          className={"text-dark-text bg-dark-bg-1 mt-6 mb-6"}
          linkClassName={"hover: hover:bg-dark-bg-2"}
        />
      </div>
      <div className={"flex p-8 pt-4 w-full items-center"} id={"p-info"}>
        <ProfilePicture image={null} className={"w-8"} />
        <div className={"flex flex-col justify-center ml-6"}>
          <p className={"text-dark-text"}>{user.first_name}</p>
          <p className={"text-dark-text"}>{user.last_name}</p>
        </div>
      </div>
    </div>
  );
}
