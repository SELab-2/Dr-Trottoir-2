import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomInputField({ icon, callback }) {
  return (
    <div
      className={
        "rounded-full bg-light-bg-2 p-4 border-solid border-4 border-light-h-2 relative flex items-center"
      }
    >
      <input type="text" className="flex-1 bg-light-bg-2 outline-0" />
      {icon ? (
        <FontAwesomeIcon
          onClick={callback}
          className="relative cursor-pointer"
          icon={icon}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
