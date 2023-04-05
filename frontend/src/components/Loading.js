import { ClipLoader } from "react-spinners";

export default function Loading({ className }) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <div className={"relative flex flex-grow justify-center items-center"}>
        <ClipLoader color={"#000"} size={50} />
      </div>
    </div>
  );
}
