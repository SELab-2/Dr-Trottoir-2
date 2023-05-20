import {
  faBuilding,
  faCalendarWeek,
  faCircle,
  faGraduationCap,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import MobileNavbarButton from "./MobileNavbarButton";
import ProfilePicture from "../ProfilePicture";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SecondaryButton from "@/components/button/SecondaryButton";
import { signOut } from "next-auth/react";

export default function MobileNavbar() {
  const buttons = [
    { icon: faCalendarWeek, link: "/student/planning", label: "planning" },
    { icon: faBuilding, link: "/student/gebouw", label: "gebouwen" },
  ];
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
    <div className="flex rounded-t-2xl w-full h-24 h-max- bg-dark-bg-1 items-center">
      <div className="flex ml-6">
        {buttons.map((button, index) => (
          <MobileNavbarButton
            key={index}
            icon={button.icon}
            link={button.link}
            label={button.label}
          ></MobileNavbarButton>
        ))}
      </div>
      <div
        className={"absolute right-0 mr-6 py-2 px-2 flex items-center"}
        id={"p-info"}
        onClick={() => setOpen((prev) => !prev)}
        ref={ref}
      >
        {open && (
          <div
            className={
              "absolute bottom-[100%] right-0 absolute z-[100] hover:z-[1000] border-2 border-light-border mt-2 rounded-lg bg-light-bg-2 mb-4 w-[180px]"
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
      </div>
    </div>
  );
}
