import "@/styles/globals.css";
import "../styles/CustomWeekPicker.css";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout";

// Needed for some fontAwesome CSS issues
// https://stackoverflow.com/questions/66539699/fontawesome-icons-not-working-properly-in-react-next-app
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function App({ session, Component, pageProps }) {
  return (
    <SessionProvider session={session} basePath="/next/auth">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
