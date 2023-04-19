import Head from "next/head";
import { useSession } from "next-auth/react";
import MobileNavbar from "./navbar/MobileNavbar";

export default function MobileLayout({ children }) {
  const { status } = useSession();

  return (
    <div className={"h-screen w-screen flex flex-col"}>
      <Head>
        <link rel="icon" href="/favicon_beer.ico" />
      </Head>

      <main className={"grow overflow-auto relative"}>{children}</main>

      {status === "authenticated" && <MobileNavbar />}
    </div>
  );
}
