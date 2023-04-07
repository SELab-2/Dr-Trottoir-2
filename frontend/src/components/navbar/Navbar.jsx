import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faEnvelopeOpenText,
  faEnvelope,
  faGrip,
  faUserGroup,
  faPeopleGroup,
  faCalendarWeek,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import NavbarList from "@/components/navbar/NavbarList";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfilePicture from "@/components/ProfilePicture";

// https://flowbite.com/docs/components/sidebar/
export default function Navbar() {
  const {
    data: { user },
  } = useSession();
  return (
    <div className={"flex flex-col sm:w-72 h-full bg-dark-bg-1 px-3 py-4"}>
      <div className={"flex"}>
        <Link href={"/home"} className={"flex justify-center w-full"}>
          <Image
            width={500}
            height={500}
            src="/images/Logo-Dr-Trottoir-GEEL-01.png"
            alt="Logo Dr.Trottoir"
            className={"w-3/5"}
          />
        </Link>
      </div>
      <div
        className={
          "overflow-y-auto overflow-x-hidden flex-grow border-b border-dark-text"
        }
      >
        <NavbarList
          name={"Menu"}
          categories={{
            Dashboard: { icon: faGrip, link: "/admin/dashboard" },
            Planning: { icon: faCalendarWeek, link: "/student/planning" },
            "Nieuwe data": { icon: faCirclePlus, link: "#" },
          }}
        />
        <NavbarList
          name={"Data"}
          categories={{
            Rondes: { icon: faBicycle, link: "#" },
            Gebouwen: { icon: faBuilding, link: "#" },
            Personeel: { icon: faPeopleGroup, link: "#" },
            Syndici: { icon: faBriefcase, link: "#" },
          }}
        />
        <NavbarList
          name={"Communicatie"}
          categories={{
            Berichten: { icon: faEnvelope, link: "#" },
            Groepen: { icon: faUserGroup, link: "#" },
            Templates: { icon: faEnvelopeOpenText, link: "#" },
          }}
        />
      </div>
      <div className={"flex p-6 w-full"} id={"p-info"}>
        <ProfilePicture image={null} />
        <div className={"flex flex-col justify-center ml-6"}>
          <p className={"text-dark-text"}>{user.first_name}</p>
          <p className={"text-dark-text"}>{user.last_name}</p>
        </div>
      </div>
    </div>
  );
}
