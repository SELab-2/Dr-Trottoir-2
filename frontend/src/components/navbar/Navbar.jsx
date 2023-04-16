import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faEnvelopeOpenText,
  faEnvelope,
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
        <Link href={"/home"}>
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
            Planning: { icon: faCalendarWeek, link: "/student/planning" },
            "Nieuwe data": {
              icon: faCirclePlus,
              link: "/admin/data_toevoegen/planning",
            },
          }}
          className={"text-dark-text bg-dark-bg-1 mt-6 mb-6"}
          linkClassName={"hover: hover:bg-dark-bg-2"}
        />
        <LinkList
          name={"Data"}
          categories={{
            Rondes: { icon: faBicycle, link: "#" },
            Gebouwen: { icon: faBuilding, link: "#" },
            Personeel: { icon: faPeopleGroup, link: "#" },
            Syndici: { icon: faBriefcase, link: "#" },
          }}
          className={"text-dark-text bg-dark-bg-1 mt-6 mb-6 "}
          linkClassName={"hover: hover:bg-dark-bg-2"}
        />
        <LinkList
          name={"Communicatie"}
          categories={{
            Berichten: { icon: faEnvelope, link: "#" },
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
