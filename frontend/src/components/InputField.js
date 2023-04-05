import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CustomInputField({
  icon,
  reference,
  callback,
  classNameDiv,
  classNameInput,
}) {
  return (
    <div
      className={`rounded-full bg-light-bg-2 p-2 border-solid border-4 border-light-h-2 relative flex items-center ${classNameDiv}`}
    >
      <input
        name={"input-field"}
        ref={reference}
        type="text"
        className={`flex-1 bg-light-bg-2 outline-none ${classNameInput}`}
      />
      {icon && (
        <FontAwesomeIcon
          data-testid="input-button"
          onClick={callback}
          className="relative cursor-pointer"
          icon={icon}
        />
      )}
    </div>
  );
}
