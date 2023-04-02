import Head from "next/head";
import Navbar from "@/components/navbar/Navbar";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user.service";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Fetch the data about the current logged in User
  useEffect(() => {
    setLoading(true);

    //TODO remove this, error handling should be done in GetLoggedInUser.
    if (session?.user) {
      UserService.getLoggedInUser().then((data) => {
        setCurrentUser(data);
      });
    }
    setLoading(false);
  }, [session?.user]);

  // TODO: change to something usefull
  if (isLoading) return <p>Loading...</p>;
  // if (!currentUser) return <p>No profile data</p>;

  // change position of the screen when no user is logged in
  let position = "ml-72";
  if (!currentUser) {
    position = "";
  }

  return (
    <div className={"h-screen w-screen"}>
      <Head>
        <link rel="icon" href="/favicon_beer.ico" />
      </Head>

      {session?.user && (
        <div>
          <Navbar user={currentUser} />
        </div>
      )}

      <div className={position}>
        <main>{children}</main>
      </div>
    </div>
  );
}
