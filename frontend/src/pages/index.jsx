import Head from "next/head";

import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png";
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { BG_ACCENT } from "@/utils/colors";

// TODO(Elias):
//   1. Add readable error messages such as 'incorrect password'
//   (Probably need a component to handle callouts in the website)
//   2. 'Wachtwoord vergeten' is not yet implemented
//   3. Figure out which email to put instead of placeholder 'help@drtrotoir.be'
//   4. Fix scaling issues

export default function Login() {
  const router = useRouter();

  const handleLogin = async (event) => {
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

    console.log("Login success! Enjoy your stay :)");
    await router.push("/home");
  };

  return (
    <>
      <Head>
        <title>Inloggen</title>
      </Head>
      <main className="h-screen flex flex-col justify-between p-12 text-sm">
        <div></div>
        <div className={"flex justify-center pb-10"}>
          <div className={"border-2 rounded-lg lg:w-1/2"}>
            <div className={"bg-dark-bg-1 flex justify-center p-8 bg-black"}>
              <Image src={Logo} alt={"logo"} width={128}></Image>
            </div>
            <form className={"py-12 p-40"} onSubmit={handleLogin}>
              <p className={"font-bold text-center mb-8 text-lg"}>Inloggen</p>
              <div>
                <div className={"pb-3"}>
                  <p className={"text-gray-600"}>Email</p>
                  <input
                    className="w-full border-2 my-2 p-1 rounded"
                    type="text"
                    id="email"
                    name="username"
                    autoComplete={"email"}
                  />
                </div>
                <div className={"pb-3"}>
                  <p className={"text-gray-600"}>Wachtwoord</p>
                  <input
                    className="w-full border-2 my-2 p-1 rounded"
                    type="password"
                    id="password"
                    name="password"
                    autoComplete={"current-password"}
                  />
                </div>
              </div>
              <button
                style={{ background: BG_ACCENT }}
                className="mt-5 mb-8 py-1 text-center w-full rounded font-bold"
                type="submit"
              >
                Log in
              </button>
              <p className={"text-center"}>
                <a className={"text-blue-500"} href={"mail://asdf@dsfs.com"}>
                  Wachtwoord Vergeten?
                </a>
              </p>
            </form>
          </div>
        </div>
        <div>
          <p className={"text-center"}>
            In geval van problemen, contacteer: <br />
            <a className={"text-blue-500"} href={"mail://asdf@dsfs.com"}>
              help@drtrotoir.be
            </a>
          </p>
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
