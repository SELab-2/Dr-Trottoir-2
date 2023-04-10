import Head from "next/head";
import Navbar from "@/components/navbar/Navbar";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const { status } = useSession();

  return (
    <div className={"h-screen w-screen flex"}>
      <Head>
        <link rel="icon" href="/favicon_beer.ico" />
      </Head>

      {status === "authenticated" && <Navbar />}

      <main className={"grow overflow-auto"}>{children}</main>
    </div>
  );
}
