import { TailSpin } from "react-loader-spinner";

export default function Loading({ className, width = 80, height = 80 }) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <div className={"relative flex flex-grow justify-center items-center"}>
        <TailSpin
          height={height}
          width={width}
          color="#000"
          radius="1"
          visible={true}
        />
      </div>
    </div>
  );
}
