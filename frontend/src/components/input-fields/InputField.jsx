import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Custom component for an input field, option for an icon on the right side.
 * @param icon Some FontAwesome icon
 * @param reference A react ref to communicate input state
 * @param iconCallback Function that will be called when the icon is clicked
 * @param keyDownCallback function that will be called when a key is pressed
 * @param classNameDiv className that will be added to the enclosing div
 * @param classNameInput className that will be added to the <input/> member
 */
export default function CustomInputField({
  icon,
  reference,
  iconCallback,
  keyDownCallback,
  classNameDiv,
  classNameInput,
}) {
  return (
    <div
      className={`rounded-lg bg-light-bg-2 p-1 border-solid border-2 border-light-h-2 relative flex items-center ${classNameDiv}`}
    >
      <input
        name={"input-field"}
        ref={reference}
        type="text"
        onKeyDown={keyDownCallback}
        className={`flex-1 bg-light-bg-2 outline-none ${classNameInput}`}
      />
      {icon && (
        <FontAwesomeIcon
          data-testid="input-button"
          onClick={iconCallback}
          className="relative cursor-pointer"
          icon={icon}
        />
      )}
    </div>
  );
}
