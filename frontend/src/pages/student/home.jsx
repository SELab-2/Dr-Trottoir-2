import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import SecondaryCard from "@/components/custom-card/SecondaryCard";
import SecondaryButton from "@/components/button/SecondaryButton";
import {
  faCreditCard,
  faHome,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import Emoji from "@/components/Emoji";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <PrimaryCard icon={faHome} title={"Student Home"} className={"m-4"}>
        <SecondaryCard icon={faIdCard} title={"Authentication"}>
          <p className={"text-xl"}>
            If you are viewing this page, you are successfully logged in as a
            student!!!!
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
      </PrimaryCard>
      <PrimaryCard className={"mx-4"} title={"Testing Ground"}></PrimaryCard>
      <PrimaryCard icon={faCreditCard} className={"m-4"} title={"By team 2"} />
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
