import Head from "next/head";

import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png";
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ROLES } from "@/utils/userRoles";
import { useState } from "react";
import { COLOR_ACCENT_2, COLOR_LIGHT_H_2 } from "@/utils/colors";
import Loading from "@/components/Loading";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleLogin = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email || !password) {
      console.log("Invalid input");
      setIsLoading(false);
      setError("Vul alle velden in");
      return;
    }

    const response = await signIn("mail-login", {
      email,
      password,
      redirect: false,
    });

    if (response?.error) {
      console.log("something went wrong... failed to login :(");
      setIsLoading(false);
      setError("Onbekende gebruiker");
      return;
    }

    const user = (await getSession()).user;
    if (user.role <= ROLES.SUPERSTUDENT) {
      await router.push("/admin/home");
    } else if (user.role === ROLES.STUDENT) {
      await router.push("/student/home");
    } else if (user.role === ROLES.SYNDICUS) {
      console.error("user not supported");
      setError("Gebruiker is nog niet ondersteund.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Dr. Trottoir: Inloggen</title>
      </Head>
      <div className={"text-sm h-screen flex items-center justify-center"}>
        <div className={"w-full max-w-3xl m-4 pb-10"}>
          <div className={"border-2 border-light-border rounded-lg shadow-lg"}>
            <div
              className={"bg-dark-bg-1 flex justify-center rounded-t-lg p-8"}
            >
              <Image src={Logo} alt={"logo"} width={128}></Image>
            </div>
            <form
              className={"bg-light-bg-1 rounded-lg p-8 sm:py-12 sm:p-40"}
              onSubmit={handleLogin}
            >
              <p
                className={"font-bold text-center mb-8 text-lg text-light-h-1"}
              >
                Inloggen
              </p>
              {error && (
                <p
                  className={
                    "text-bad-1 mt-3 text-center bg-bad-2 rounded py-2 border-bad-1 border-1 mb-5 border-[1px]"
                  }
                >
                  {error}
                </p>
              )}
              <div>
                <div className={"pb-3"}>
                  <p className={"text-light-text"}>Email</p>
                  <input
                    className="w-full border-2 border-light-border my-2 p-1 rounded"
                    type="text"
                    id="email"
                    name="username"
                    autoComplete={"email"}
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
                </div>
              </div>
              <div className={"mt-5 mb-8"}>
                {isLoading ? (
                  <div className="flex justify-center items-center py-1 h-8 text-center w-full rounded font-bold rounded bg-accent-2 text-dark-h-1">
                    <Loading
                      className={"w-6 h-6 "}
                      color={COLOR_LIGHT_H_2}
                      backgroundColor={COLOR_ACCENT_2}
                    ></Loading>
                  </div>
                ) : (
                  <button
                    className="flex justify-center items-center bg-accent-1 py-1 h-8 text-center w-full rounded font-bold rounded hover:bg-accent-3 active:bg-accent-2 active:text-dark-h-1"
                    type="submit"
                  >
                    Registreer
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
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
