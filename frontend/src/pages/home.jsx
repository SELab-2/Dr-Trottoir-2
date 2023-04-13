import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import BuildingService from "@/services/building.service";
import UserService from "@/services/user.service";
import { useRouter } from "next/router";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import {
  faBuilding,
  faCheck,
  faCreditCard,
  faHome,
  faIdCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Emoji from "@/components/Emoji";

export default function Home() {
  const [response, setResponse] = useState("{}");
  const router = useRouter();

  const allBuildings = async () => {
    const response = await BuildingService.getAll();
    setResponse(JSON.stringify(response, null, 2));
  };

  const allUsers = async () => {
    const response = await UserService.getAll();
    setResponse(JSON.stringify(response, null, 2));
  };

  return (
    <>
      <PrimaryCard icon={faHome} title={"Home"} className={"m-4"}>
        <SecondaryCard icon={faIdCard} title={"Authentication"}>
          <p className={"text-xl"}>
            If you are viewing this page, you are successfully logged in{" "}
            <Emoji>🥳</Emoji>
          </p>
          <SecondaryButton
            className={"my-2"}
            onClick={() => {
              signOut({ redirect: false }).then(() => router.push("/"));
            }}
          >
            log out
          </SecondaryButton>
        </SecondaryCard>
        <SecondaryCard
          icon={faCheck}
          title={"Test fetching"}
          className={"my-4"}
        >
          <PrimaryButton onClick={allBuildings} icon={faBuilding}>
            All buildings
          </PrimaryButton>
          <PrimaryButton onClick={allUsers} icon={faUser}>
            All users
          </PrimaryButton>
          <PrimaryButton onClick={allUsers}> All users </PrimaryButton>
          <PrimaryCard title={"Response"} className={"my-4"}>
            <pre> {response} </pre>
          </PrimaryCard>
        </SecondaryCard>
      </PrimaryCard>
      <PrimaryCard icon={faCreditCard} className={"m-4"}>
        <p className={"font-bold"}>By team 2</p>
      </PrimaryCard>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
