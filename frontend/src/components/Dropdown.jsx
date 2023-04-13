import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

/**
 * Dropdown menu where you can select one or multiple elements.
 * It supports selecting exactly one element and multiple elements.
 * @param children Element displayed in the button of the dropdown menu.
 * @param className Add extra classes to the dropdown component.
 * @param listClassName
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
  listClassName,
  icon,
  onClick,
  options,
  multi = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);

  const onButtonPressed = () => {
    setIsOpen(!isOpen);
  };

  const onElementPressed = (index) => {
    let selected = selectedIndices.includes(index)
      ? multi
        ? selectedIndices.filter((e) => e !== index)
        : []
      : multi
      ? [...selectedIndices, index]
      : [index];
    setSelectedIndices(selected);
    onClick && onClick(selected.sort().map((i) => options[i]));
  };

  return (
    <div className={`${className}`}>
      <button
        className={`align-middle border-2 py-2 px-3 text-center rounded-lg font-bold w-fit mb-2 ${
          selectedIndices.length !== 0 ? `bg-primary-2 text-primary-1` : ``
        }`}
        onClick={onButtonPressed}
      >
        <div className={"flex items-center justify-center"}>
          {icon && <FontAwesomeIcon icon={icon} className={"h-4"} />}
          <div className={`${icon ? "mx-4" : "mx-2"}`}>{children}</div>
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </div>
      </button>
      {isOpen && (
        <ul
          className={`absolute z-[100] hover:z-[1000] shadow border-2 rounded-lg bg-light-bg-1 ${listClassName}`}
        >
          {options !== null && options.length !== 0 ? (
            options.map((ele, index) => (
              <li
                className={`cursor-pointer rounded-lg p-2 m-2 font-bold ${
                  selectedIndices.includes(index)
                    ? "bg-primary-2 text-primary-1"
                    : "hover:bg-light-bg-2"
                }`}
                key={index}
                onClick={() => onElementPressed(index, options)}
              >
                {ele}
              </li>
            ))
          ) : (
            <li className={"text-bad-1"}>No options available</li>
          )}
        </ul>
      )}
    </div>
  );
}
