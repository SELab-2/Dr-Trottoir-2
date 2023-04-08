import Image from "next/image";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProfilePicture({ image, className = "w-12" }) {
  return (
    <div className={className}>
      {image ? (
        <Image
          className="rounded-full object-fill"
          src={image}
          alt="profile picture"
        />
      ) : (
        <FontAwesomeIcon
          icon={faUser}
          className={
            "bg-primary-2 text-primary-1 rounded-full aspect-square pt-2"
          }
        />
      )}
    </div>
  );
}
