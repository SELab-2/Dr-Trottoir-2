import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({ session, Component, pageProps }) {
  return (
    <SessionProvider session={session} basePath="/next/auth">
      <Component {...pageProps} />
    </SessionProvider>
  );
}
