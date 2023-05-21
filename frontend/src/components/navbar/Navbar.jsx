import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faEnvelopeOpenText,
  faPeopleGroup,
  faCalendarWeek,
  faCirclePlus,
  faRightFromBracket,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import LinkList from "@/components/navbar/LinkList";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import ProfilePicture from "@/components/ProfilePicture";
import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png";
import SecondaryButton from "@/components/button/SecondaryButton";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

// https://flowbite.com/docs/components/sidebar/
export default function Navbar() {
  const {
    data: { user },
  } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            Databeheer: {
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
            "Mail-templates": {
              icon: faEnvelopeOpenText,
              link: "/beheer/templates",
            },
          }}
          className={"text-dark-text bg-dark-bg-1 mt-6 mb-6"}
          linkClassName={"hover: hover:bg-dark-bg-2"}
        />
      </div>
      <div
        className={"flex p-8 pt-4 w-full items-center relative cursor-pointer"}
        id={"p-info"}
        onClick={() => setOpen(true)}
        ref={ref}
      >
        {open && (
          <div
            className={
              "absolute bottom-[100%] absolute z-[100] hover:z-[1000] border-2 border-light-border mt-2 rounded-lg bg-light-bg-2 mb-4 w-[180px]"
            }
          >
            <SecondaryButton
              onClick={async () => {
                await signOut({ redirect: false });
                await router.push("/");
              }}
              icon={faRightFromBracket}
              className={"w-full mb-1"}
            >
              Uitloggen
            </SecondaryButton>
            <SecondaryButton
              onClick={() => router.push("/student/planning")}
              icon={faGraduationCap}
              className={"w-full"}
            >
              Naar Student
            </SecondaryButton>
          </div>
        )}
        <ProfilePicture image={null} className={"w-8"} />
        <div className={"flex flex-col justify-center ml-6"}>
          <p className={"text-dark-text"}>{user.first_name}</p>
          <p className={"text-dark-text"}>{user.last_name}</p>
        </div>
      </div>
    </div>
  );
}
