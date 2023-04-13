import Image from "next/image";

export default function ProfilePicture({ image, className = "w-9" }) {
  return (
    <div className={className}>
      {image ? (
        <Image
          className="rounded-full object-fill"
          src={image}
          alt="profile picture"
        />
      ) : (
        // At the moment we use an svg tag. We did this because of scaling issues.
        <svg
          className={
            "aspect-square rounded-full fill-primary-1 bg-primary-2 pt-2"
          }
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          {/* Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
          <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
        </svg>
      )}
    </div>
  );
}
