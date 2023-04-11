import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Temporary solution until dropdownmenu
export default function CustomDropDown({
  icon,
  title,
  selected, // string (if no multiple) or set (if multi) of selected values
  handleChange, // callback function
  options, // array of options
  multi = true, // boolean that indicates if multiple options can be selected
}) {
  const [open, setOpen] = useState(false);
  const [sel, setSelected] = useState(selected);

  const changeOpen = () => {
    setOpen(!open);
  };

  const changeSelected = (option) => {
    let updatedSelected = null;
    if (multi) {
      updatedSelected = new Set(sel);
      if (updatedSelected.has(option)) {
        updatedSelected.delete(option);
      } else {
        updatedSelected.add(option);
      }
    } else {
      if (sel === option) {
        updatedSelected = null;
      } else {
        updatedSelected = option;
      }
    }
    setSelected(updatedSelected);
    handleChange(updatedSelected);
  };

  return (
    <div className="relative">
      <div
        className={`cursor-pointer border-2 border-light-h-2 mt-5 py-3 px-6 text-center rounded-md font-bold overflow-hidden relative ${
          sel == null || sel.size == 0 ? "" : "bg-selected-bg text-selected-h"
        }`}
        onClick={changeOpen}
      >
        {icon && <FontAwesomeIcon icon={icon} className={"mr-3"} />}
        <span className="flex-1 whitespace-nowrap">{title}</span>
      </div>
      {open && (
        <div className="bg-light-bg-1 border-x-2 border-b-2 border-light-h-2 font-bold text-light-text -mt-1 p-2 rounded-b-md">
          {options.map((option, index) => (
            <div
              className={`cursor-pointer rounded-md text-bg-light-bg-1 my-2 p-2 ${
                (!multi && option === sel) || (multi && sel.has(option))
                  ? "bg-selected-bg text-selected-h"
                  : "hover:bg-light-bg-2"
              }`}
              key={index}
              onClick={() => changeSelected(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
