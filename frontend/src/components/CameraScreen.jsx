import Webcam from "react-webcam";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomButton from "@/components/button/Button";

export default function PhotoScreen({ savePicture, close }) {
  return (
    <div className={"flex-col space-y-2"}>
      <Webcam
        audio={false}
        height={720}
        screenshotFormat="image/png"
        width={1280}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "environment",
        }}
      >
        {({ getScreenshot }) => (
          <div className={"flex flex-row"}>
            <PrimaryButton
              className={"w-full"}
              onClick={() => {
                const imageSrc = getScreenshot();
                savePicture(imageSrc);
                console.log(imageSrc);
              }}
            >
              Capture photo
            </PrimaryButton>
            <CustomButton className={"bg-bad-1 text-dark-h-1"} onClick={close}>
              Cancel
            </CustomButton>
          </div>
        )}
      </Webcam>
    </div>
  );
}
