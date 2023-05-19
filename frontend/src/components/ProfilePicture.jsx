import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SecondaryButton from "@/components/button/SecondaryButton";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePicture({ image, className = "w-9" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      {open && (
        <div
          className={
            "absolute bottom-[100%] absolute z-[100] hover:z-[1000] border-1 border-light-border mt-2 rounded-lg bg-light-bg-1 mb-4"
          }
        >
          <SecondaryButton
            onClick={async () => {
              await signOut({ redirect: false });
              await router.push("/");
            }}
            icon={faRightFromBracket}
          >
            Uitloggen
          </SecondaryButton>
        </div>
      )}
      {image ? (
        <Image
          className="rounded-full object-fill"
          src={image}
          alt="profile picture"
          onClick={() => setOpen(true)}
        />
      ) : (
        // At the moment we use an svg tag. We did this because of scaling issues.
        <svg
          className={
            "aspect-square rounded-full fill-primary-1 bg-primary-2 pt-2"
          }
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          onClick={() => setOpen(true)}
        >
          {/* Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
        </svg>
      )}
    </div>
  );
}
