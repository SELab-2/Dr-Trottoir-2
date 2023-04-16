import PrimaryCard from "@/components/custom-card/PrimaryCard";
import LinkList from "@/components/navbar/LinkList";
import {
  faBicycle,
  faBriefcase,
  faBuilding,
  faCalendarWeek,
  faPeopleGroup,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";

export default function LayoutDataAdd({ children }) {
  return (
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
      {children}
    </div>
  );
}
