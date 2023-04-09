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
  return (
    <>
      <Head>
        <title>Dasboard</title>
      </Head>

      <div className={"flex m-2"}>
        <CustomWeekPicker></CustomWeekPicker>
      </div>

      <PrimaryCard>
        <div id={"statistics"} className={"flex flex-row"}>
          <SecondaryCard title={"Aantal Rondes"} className={"flex-grow"}>
            <p>Aantal rondes</p>
          </SecondaryCard>
          <SecondaryCard title={"Aantal opmerkingen"} className={"flex-grow"}>
            <p>aantal opmerkingen</p>
          </SecondaryCard>
          <SecondaryCard title={"Overview"} className={"flex-grow"}>
            <p>Overview</p>
          </SecondaryCard>
        </div>

        <div id={"rondes"}>
          <SecondaryCard title={"Rondes"}>
            <PrimaryCard>
              <div className={"flex flex-row justify-center items-center"}>
                <div className={"flex items-center px-2 items-center"}>
                  <PrimaryButton text={"Filter"} icon={faFilter} />
                </div>

                <div className={"px-2"}>
                  <PrimaryButton text={"Sort"} icon={faSort} />
                </div>

                <div className={"flex-grow px-2"}>
                  <CustomInputField icon={faMagnifyingGlass} />
                </div>

                <div className={"px-2"}>
                  <PrimaryButton text={"Nieuw"} icon={faPlusCircle} />
                </div>
              </div>
            </PrimaryCard>

            <PrimaryCard>
              <p>Lijst</p>
            </PrimaryCard>
          </SecondaryCard>
        </div>
      </PrimaryCard>
    </>
  );
}
