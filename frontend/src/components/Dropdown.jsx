import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

/**
 * Dropdown menu where you can select one or multiple elements.
 * It supports selecting exactly one element and multiple elements.
 * @param children Element displayed in the button of the dropdown menu.
 * @param className Add extra classes to the dropdown component.
 * @param icon If icon is not null, this will be displayed on the left.
 * @param onClick Function that is executed when element in the dropdown is selected.
 *        This function expects 1 argument, a list of all selected elements.
 * @param options List of all the options. These needs to be strings/components.
 * @param multi Indicates if multiple elements can be selected.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Dropdown({
  children,
  className,
  icon,
  onClick,
  options,
  multi = false,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  // Function that does the handling when an options is pressed.
  const changeSelected = (indexEl, options) => {
    // Value is the index of the element in the list.
    // We use the index because elements with the same name will be highlighted.
    let newSelected = [...selected]; // Use new object because States in react check for a new object.
    if (newSelected.includes(indexEl)) {
      newSelected.splice(newSelected.indexOf(indexEl), 1);
    } else {
      if (!multi) {
        newSelected = [];
      }
      newSelected.push(indexEl);
    }
    setSelected(newSelected);
    // calling onClick on selected runs 1 click behind
    onClick(newSelected.map((i) => options[i]));
  };

  return (
    <div className={className}>
      <div className={"relative"}>
        <button
          className={`relative border-2 border-light-h-2 text-center rounded-md bg-light-bg-1 font-bold z-10 ${
            selected.length !== 0 ? "bg-primary-2" : "bg-light-bg-1"
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className={"flex flex-row justify-center items-center m-2"}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {children}
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
          </div>
        </button>

        {open && (
          <ul
            className={`absolute w-full bg-light-bg-1 border-x-2 border-b-2 rounded-b-md border-light-h-2 p-2 -mt-2`}
          >
            {options.map((option, index) => (
              <li
                className={`cursor-pointer rounded-md text-bg-light-bg-1 my-2 p-2 font-bold ${
                  selected.includes(index)
                    ? "bg-primary-2 text-selected-h text-primary-1"
                    : "hover:bg-light-bg-2"
                }`}
                key={index}
                onClick={() => changeSelected(index, options)}
              >
                <div className={"overflow-hidden"}>{option}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
