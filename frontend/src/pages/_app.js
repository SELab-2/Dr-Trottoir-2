import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout";

export default function App({ session, Component, pageProps }) {
  return (
    <SessionProvider session={session} basePath="/next/auth">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
