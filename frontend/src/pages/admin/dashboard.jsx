import Head from "next/head";
import PrimaryButton from "@/components/button/PrimaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import CustomInputField from "@/components/input-fields/InputField";
import {
  faFilter,
  faMagnifyingGlass,
  faPlusCircle,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";

export default function AdminDashboardPage() {
  const dummy = () => console.log("Dummy");

  return (
    <>
      <PrimaryCard>
        <div id={"statistics"} className={"flex flex-row"}>
          <SecondaryCard title={"Aantal Rondes"} className={"flex-grow m-2"}>
            <p>Aantal rondes</p>
          </SecondaryCard>
          <SecondaryCard
            title={"Aantal opmerkingen"}
            className={"flex-grow m-2"}
          >
            <p>aantal opmerkingen</p>
          </SecondaryCard>
          <SecondaryCard title={"Overview"} className={"flex-grow m-2"}>
            <p>Overview</p>
          </SecondaryCard>
        </div>

        <div id={"rondes"}>
          <SecondaryCard title={"Rondes"} className={"m-2"}>
            <PrimaryCard className={"my-2"}>
              <div className={"flex flex-row justify-center items-center"}>
                <div className={"px-2"}>
                  <PrimaryButton icon={faFilter} onClick={dummy}>
                    <p>Filter</p>
                  </PrimaryButton>
                </div>

                <div className={"px-2"}>
                  <PrimaryButton icon={faSort} onClick={dummy}>
                    <p>Sort</p>
                  </PrimaryButton>
                </div>

                <div className={"flex-grow px-2 h-full"}>
                  <CustomInputField icon={faMagnifyingGlass} />
                </div>

                <div className={"px-2"}>
                  <PrimaryButton text={"Nieuw"} icon={faPlusCircle}>
                    <p>Nieuw</p>
                  </PrimaryButton>
                </div>
              </div>
            </PrimaryCard>

            <PrimaryCard className={"my-2"}>
              <p>Lijst</p>
            </PrimaryCard>
          </SecondaryCard>
        </div>
      </PrimaryCard>
    </>
  );
}
