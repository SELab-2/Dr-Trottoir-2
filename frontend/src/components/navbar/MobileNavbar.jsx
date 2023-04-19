import {
  faBuilding,
  faCalendarWeek,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import MobileNavbarButton from "./MobileNavbarButton";
import ProfilePicture from "../ProfilePicture";

export default function MobileNavbar() {
  const buttons = [
    { icon: faCalendarWeek, link: "/student/planning", label: "planning" },
    { icon: faBuilding, link: "#", label: "gebouwen" },
  ];

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
      <div className={"absolute right-0 mr-6 py-2 px-2 flex items-center"} id={"p-info"}>
        <ProfilePicture image={null} className={"w-8"} />
      </div>
    </div>
  );
}
