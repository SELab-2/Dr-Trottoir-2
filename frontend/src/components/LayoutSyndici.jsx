import Head from "next/head";
import Navbar from "@/components/navbar/Navbar";
import { useSession } from "next-auth/react";

export default function LayoutSyndici({ children }) {
  const { status } = useSession();

  return (
    <div className={"h-screen w-screen flex"}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"grow overflow-auto relative"}>{children}</main>
    </div>
  );
}
