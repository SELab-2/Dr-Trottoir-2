import Head from "next/head";

import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png";
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ROLES } from "@/utils/userRoles";

export default function Signup() {
  const router = useRouter();

  const handleSignup = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email || !password) {
      console.log("Invalid input");
      return;
    }

    const response = await signIn("mail-login", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      console.log("something went wrong... failed to login :(");
      return;
    }

    const user = (await getSession()).user;
    if (user.role <= ROLES.SUPERSTUDENT) {
      // User is developer, admin or super-student
      await router.push("/admin/home");
    } else if (user.role === ROLES.STUDENT) {
      // User is student
      await router.push("/student/home");
    } else {
      console.log(
        "We found you in our database but unfortunately we don't have a nice ui for you :("
      );
    }
  };

  return (
    <>
      <Head>
        <title>Dr. Trottoir: Registeren</title>
      </Head>
      <main className={"text-sm min-h-screen flex items-center justify-center"}>
        <div className={"w-full max-w-4xl m-4"}>
          <div className={"border-2 border-light-border rounded-lg shadow-lg"}>
            <div
              className={"bg-dark-bg-1 flex justify-center rounded-t-lg p-8"}
            >
              <Image src={Logo} alt={"logo"} width={128}></Image>
            </div>
            <form
              className={"bg-light-bg-1 rounded-lg p-8 sm:py-12 sm:p-40"}
              onSubmit={handleSignup}
            >
              <p
                className={"font-bold text-center mb-8 text-lg text-light-h-1"}
              >
                Registeren
              </p>
              <div>
                <div className={"block sm:flex"}>
                  <div className={"pb-3 basis-1/2 pr-0 sm:pr-1"}>
                    <p className={"text-light-text"}>Voornaam</p>
                    <input
                      className="w-full border-2 border-light-border my-2 p-1 rounded"
                      type="text"
                      id="voornaam"
                      name="voornaam"
                    />
                  </div>
                  <div className={"basis-1/2 pl-0 sm:pl-1"}>
                    <p className={"text-light-text"}>Achternaam</p>
                    <input
                      className="w-full border-2 border-light-border my-2 p-1 rounded"
                      type="text"
                      id="achternaam"
                      name="achternaam"
                    />
                  </div>
                </div>
                <div className={"pb-3"}>
                  <p className={"text-light-text"}>Email</p>
                  <input
                    className="w-full border-2 border-light-border my-2 p-1 rounded"
                    type="text"
                    id="email"
                    name="username"
                    autoComplete={"email"}
                  />
                  <p className={"text-light-text"}>Telefoon</p>
                  <input
                    className="w-full border-2 border-light-border my-2 p-1 rounded"
                    type="tel"
                    id="tel"
                    name="tel"
                    autoComplete={"tel"}
                  />
                </div>
                <div className={"pb-3"}>
                  <p className={"text-gray-600"}>Wachtwoord</p>
                  <input
                    className="w-full border-2 border-light-border my-2 p-1 rounded"
                    type="password"
                    id="password"
                    name="password"
                    autoComplete={"current-password"}
                  />
                  <p className={"text-gray-600"}>Herhaal wachtwoord</p>
                  <input
                    className="w-full border-2 border-light-border my-2 p-1 rounded"
                    type="password"
                    id="password"
                    name="password"
                    autoComplete={"current-password"}
                  />
                </div>
              </div>
              <button
                className="bg-accent-1 mt-5 mb-8 py-1 text-center w-full rounded font-bold"
                type="submit"
              >
                Registreer
              </button>
            </form>
          </div>
          <div className={"p-8 pb-12 text-center"}>
            <p>In geval van problemen contacteer: </p>
            <p>
              <a className={"text-primary-1"}>bob@bobmail.bob</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
