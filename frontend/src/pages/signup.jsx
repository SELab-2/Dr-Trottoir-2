import Head from "next/head";
import Logo from "/public/images/Logo-Dr-Trottoir-GEEL-01.png";
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import UserService from "@/services/user.service";

function SignupInput({ field, updateField, id, type, autocomplete }) {
  return (
    <div>
      <input
        id={id}
        type={type}
        autoComplete={autocomplete}
        className={`w-full bg-light-bg-2 border-2 my-2 p-1 rounded ${
          field.error
            ? `text-bad-1 border-bad-1 focus:outline-bad-1`
            : `border-light-border`
        }`}
        value={field.value}
        onChange={(event) => {
          updateField({ value: event.target.value, error: null });
        }}
      />
      {field.error && <p className={"text-bad-1 pb-3"}>{field.error}</p>}
    </div>
  );
}

export default function Signup() {
  const [registrationStatus, setRegistrationStatus] = useState({
    complete: false,
  });

  const [firstname, setFirstname] = useState({ value: "", error: null });
  const [lastname, setLastname] = useState({ value: "", error: null });
  const [email, setEmail] = useState({ value: "", error: null });
  const [tel, setTel] = useState({ value: "", error: null });
  const [password, setPassword] = useState({ value: "", error: null });
  const [repeatPassword, setRepeatPassword] = useState({
    value: "",
    error: null,
  });

  const validateRequired = (value) => {
    if (value.length < 1) {
      return `Dit veld is verplicht`;
    }
  };

  const validateMustMatch = (value, source, message) => {
    if (value !== source) {
      return message ? message : "Veld is niet gelijk";
    }
  };

  const validateLength = (value, min, max) => {
    if (min === max) {
      if (value.length !== max) {
        return `Veld moet ${max} characters lang zijn.`;
      }
    } else if (value.length < min) {
      return `Veld moet minstens ${min} characters lang zijn.`;
    } else if (value.length > max) {
      return `Veld mag maximum ${max} characters lang zijn`;
    }
  };

  const allValid = (field, setField, validations) => {
    for (let i = 0; i < validations.length; ++i) {
      const error = validations[i](field.value);
      if (error) {
        setField({ value: field.value, error: error });
        return;
      }
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    const valid = true;
    valid &&
      allValid(firstname, setFirstname, [
        validateRequired,
        (v) => validateLength(v, 2, 64),
      ]);
    valid &&
      allValid(lastname, setLastname, [
        validateRequired,
        (v) => validateLength(v, 2, 64),
      ]);
    valid &&
      allValid(email, setEmail, [
        validateRequired,
        (v) => validateLength(v, 2, 128),
        (v) => (!v.includes("@") ? `Geen geldige email` : null),
      ]);
    valid &&
      allValid(tel, setTel, [
        validateRequired,
        (v) => validateLength(v, 12, 12),
      ]);
    valid &&
      allValid(password, setPassword, [
        validateRequired,
        (v) => validateLength(v, 8, 40),
      ]);
    valid &&
      allValid(repeatPassword, setRepeatPassword, [
        validateRequired,
        (v) =>
          validateMustMatch(v, password.value, "Wachtwoorden zijn niet gelijk"),
      ]);

    if (!valid) {
      return;
    }

    /*
    const okay = await UserService.register({
      first_name: firstname.value,
      last_name: lastname.value,
      email: email.value,
      password: password.value,
      password2: repeatPassword.value,
    });
    */

    const okay = true;

    if (okay) {
      setRegistrationStatus({ complete: true });
    } else {
      setRegistrationStatus({
        complete: false,
        error: "Er ging iets mis! Probeer het opnieuw.",
      });
    }
  };

  let boxBody = <></>;
  if (registrationStatus.complete) {
    boxBody = (
      <>
        <div className={"flex flex-col justify-center items-center h-56"}>
          <p className={"font-bold text-lg pb-2 text-center"}>
            Registratie ingediend!
          </p>
          <p className={"text-center"}>
            Een beheerder zal zo snel mogelijk de registratie goedkeuren.
          </p>
        </div>
      </>
    );
  } else {
    boxBody = (
      <form onSubmit={handleSignup}>
        <p className={"font-bold text-center mb-8 text-lg text-light-h-1"}>
          Registeren
        </p>
        <div className={""}>
          <div className={"block sm:flex pb-3"}>
            <div className={"basis-1/2 pr-0 sm:pr-1"}>
              <p className={"text-light-text"}>Voornaam</p>
              <SignupInput
                id={"voornaam"}
                type={"text"}
                field={firstname}
                updateField={setFirstname}
              />
            </div>
            <div className={"basis-1/2 pl-0 sm:pl-1"}>
              <p className={"text-light-text"}>Achternaam</p>
              <SignupInput
                id={"achternaam"}
                type={"text"}
                field={lastname}
                updateField={setLastname}
              />
            </div>
          </div>
          <div className={"pb-3"}>
            <p className={"text-light-text"}>Email</p>
            <SignupInput
              id={"email"}
              type={"text"}
              field={email}
              updateField={setEmail}
            />
            <p className={"text-light-text"}>Telefoon</p>
            <SignupInput
              id={"tel"}
              type={"tel"}
              autocomplete={"tel"}
              field={tel}
              updateField={setTel}
            />
          </div>
          <div className={"pb-3"}>
            <p className={"text-gray-600"}>Wachtwoord</p>
            <SignupInput
              id={"password"}
              type={"password"}
              autocomplete={"new-password"}
              field={password}
              updateField={setPassword}
            />
            <p className={"text-gray-600"}>Herhaal wachtwoord</p>
            <SignupInput
              id={"repeatpassword"}
              type={"password"}
              autocomplete={"new-password"}
              field={repeatPassword}
              updateField={setRepeatPassword}
            />
          </div>
        </div>
        <button
          className="bg-accent-1 mt-5 mb-8 py-1 text-center w-full rounded font-bold rounded hover:bg-accent-3 active:bg-accent-2 active:text-dark-h-1"
          type="submit"
        >
          Registreer
        </button>
      </form>
    );
  }

  return (
    <>
      <Head>
        <title>Dr. Trottoir: Registeren</title>
      </Head>
      <div className={"text-sm min-h-screen flex items-center justify-center"}>
        <div className={"w-full max-w-4xl m-4"}>
          <div className={"border-2 border-light-border rounded-lg shadow-lg"}>
            <div
              className={"bg-dark-bg-1 flex justify-center rounded-t-lg p-8"}
            >
              <Image src={Logo} alt={"logo"} width={128}></Image>
            </div>
            <div className={"bg-light-bg-1 rounded-lg p-8 sm:py-12 sm:p-40"}>
              {boxBody}
            </div>
          </div>
          <div className={"p-8 pb-12 text-center"}>
            <p>In geval van problemen contacteer: </p>
            <p>
              <a className={"text-primary-1"}>bob@bobmail.bob</a>
            </p>
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
