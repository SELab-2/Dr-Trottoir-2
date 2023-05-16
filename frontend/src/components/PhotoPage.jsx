import Image from "next/image";
import { useEffect, useState } from "react";

export default function PhotoPage({ photo }) {
  console.log(photo);
  return (
    <div className={"flex flex-col space-y-2 h-full"}>
      <div className={"w-full rounded-lg border-2 overflow-hidden"}>
        {photo !== "" && (
          <Image
            src={photo}
            alt="uploaded"
            width={1280}
            height={600}
            layout="intrinsic"
            objectFit="cover"
            className="h-4/5"
          />
        )}
      </div>
    </div>
  );
}
