import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Custom component for an input field, option for an icon on the right side.
 * @param icon Some FontAwesome icon
 * @param reference A react ref to communicate input state
 * @param actionCallback Function that will be called when either enter is pressed or the icon is clicked
 * @param iconCallback Function that will be called when the icon is clicked
 * @param keyDownCallback Function that will be called when a key is pressed
 * @param classNameDiv className that will be added to the enclosing div
 * @param classNameInput className that will be added to the <input/> member
 */
export default function CustomInputField({
  icon,
  reference,
  iconCallback,
  keyDownCallback,
  actionCallback,
  classNameDiv,
  classNameInput,
}) {
  const combinedKeyCallback = (event) => {
    if (event.key === "Enter" && actionCallback !== undefined) {
      actionCallback(event);
    }
    if (keyDownCallback !== undefined) keyDownCallback(event);
  };

  const combinedIconCallback = (event) => {
    if (iconCallback !== undefined) iconCallback(event);
    if (actionCallback !== undefined) actionCallback(event);
  };

  return (
    <div
      className={`rounded-lg bg-light-bg-2 p-1 border-2 border-light-border relative flex items-center ${classNameDiv}`}
    >
      <input
        name={"input-field"}
        ref={reference}
        type="text"
        onKeyDown={combinedKeyCallback}
        className={`flex-1 bg-light-bg-2 outline-none ${classNameInput}`}
      />
      {icon && (
        <FontAwesomeIcon
          data-testid="input-button"
          onClick={combinedIconCallback}
          className="relative cursor-pointer m-1"
          icon={icon}
        />
      )}
    </div>
  );
}
