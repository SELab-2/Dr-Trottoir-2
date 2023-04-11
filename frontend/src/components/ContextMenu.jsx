import { useEffect } from "react";
import { BG_DARK_PRIMARY, LIGHT_SECONDARY } from "@/utils/colors";

export default function ContextMenu({
  x,
  y,
  closeContextMenu,
  options,
  classNameDiv,
  classNameOption,
}) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside of the context menu, close it
      if (!event.target.closest(".context-menu")) {
        closeContextMenu(null);
      }
    };
    // Add event listener to handle clicks outside of the context menu
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [closeContextMenu]);

  return (
    <div
      onClick={() => closeContextMenu()}
      className={`absolute p-2 rounded-md bg-light-bg-1 border-light-h-2 border-2 ${classNameDiv}`}
      style={{ top: y, left: x }}
    >
      {options.map((value) => (
        <div
          className={`cursor-pointer hover:bg-selected-bg p-2 rounded-md ${classNameOption}`}
          key={value}
          onClick={() => closeContextMenu(value)}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
