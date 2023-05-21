import Layout from "@/components/Layout";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import {
  faBuilding,
  faFilter,
  faPlusCircle,
  faRightFromBracket,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading";
import buildingService from "@/services/building.service";
import { urlToPK } from "@/utils/urlToPK";
import Dropdown from "@/components/Dropdown";
import CustomInputField from "@/components/input-fields/InputField";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";
import { getSession, signOut, useSession } from "next-auth/react";
import LayoutSyndici from "@/components/LayoutSyndici";
import SecondaryButton from "@/components/button/SecondaryButton";

export default function SyndicyBuildings() {
  const router = useRouter();

  const states = Object.freeze({
    waiting: "waiting",
    empty: "empty",
  });

  const [loadState, setLoadState] = useState(states.waiting);

  useEffect(() => {
    const redirectToBuilding = async () => {
      const user = (await getSession()).user;
      const buildings = await buildingService.getOwnedByMe(user);
      if (buildings.length > 0)
        router.push(`/syndicus/gebouwen/${urlToPK(buildings[0]["url"])}`);
      else setLoadState(states.empty);
    };

    redirectToBuilding();
  });

  return (
    <>
      <Head>
        <title>Gebouwen</title>
      </Head>
      <div className={"h-4/5"}>
        <PrimaryCard className={"m-2"}>
          <div className={"flex justify-between"}>
            <div className={"flex"}>
              <Dropdown
                icon={faFilter}
                text={"Filter"}
                className={"mr-2"}
                multi={true}
              >
                Filter Regio
              </Dropdown>
              <Dropdown
                icon={faSort}
                text={"Sort"}
                className={"mr-2"}
                options={["Naam", "Adres"]}
              >
                Sorteer
              </Dropdown>
              <CustomInputField classNameDiv={"w-80"} icon={faSearch} />
            </div>
            <SecondaryButton
              onClick={async () => {
                await signOut({ redirect: false });
                await router.push("/");
              }}
              icon={faRightFromBracket}
            >
              Uitloggen
            </SecondaryButton>
          </div>
        </PrimaryCard>
        <div className="flex">
          <PrimaryCard icon={faBuilding} className={"m-2 basis-3/4 autogrow"}>
            <div className={"flex items-center justify-center grow"}>
              {loadState === states.waiting ? (
                <Loading className="w-20" />
              ) : (
                <p className={"text-lg"}>Geen gebouwen gevonden.</p>
              )}
            </div>
          </PrimaryCard>
          <div className={"m-2 basis-1/4 max-h-4/5"}>
            <PrimaryCard title={"Selecteer week"} className={"mb-3"}>
              <CustomWeekPicker className="!light-bg-1" />
            </PrimaryCard>
          </div>
        </div>
      </div>
    </>
  );
}

SyndicyBuildings.getLayout = function getLayout(page) {
  return <LayoutSyndici>{page}</LayoutSyndici>;
};
