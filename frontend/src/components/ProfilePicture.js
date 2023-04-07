import Image from "next/image";

export function ProfilePicture({ srcPath, width, height }) {
  return (
    <div className="relative m-2" style={{ width: width, height: height }}>
      <Image
        src={srcPath}
        alt="Profile picture"
        className="rounded-full object-cover"
        style={{ aspectRatio: `${width}/${height}` }}
      />
    </div>
  );
}
