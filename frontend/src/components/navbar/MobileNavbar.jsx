import {
  faBuilding,
  faCalendarWeek,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import MobileNavbarButton from "./MobileNavbarButton";

export default function MobileNavbar() {
  const buttons = [
    { icon: faBuilding, link: "#" },
    { icon: faCalendarWeek, link: "#" },
  ];

  const circleButton = { icon: faCircle, link: "#" };

  return (
    <div className="flex rounded-t-2xl w-full h-24 h-max- bg-dark-bg-1 items-center">
      <div className="flex ml-6">
        {buttons.map((button, index) => (
          <MobileNavbarButton
            key={index}
            icon={button.icon}
            link={button.link}
          ></MobileNavbarButton>
        ))}
      </div>
      <div className="absolute right-0 mr-6">
        <MobileNavbarButton
          icon={circleButton.icon}
          link={circleButton.link}
        ></MobileNavbarButton>
      </div>
    </div>
  );
}
