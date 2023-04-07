import { useEffect } from "react";
import { BG_DARK_PRIMARY, LIGHT_SECONDARY } from "@/utils/colors";

export default function ContextMenu({ x, y, closeContextMenu, options}) {
    const handleClickOutside = (event) => {
      // If the click is outside of the context menu, close it
      if (!event.target.closest(".context-menu")) {
        closeContextMenu();
      }
    };
    
    useEffect(() => {
      // Add event listener to handle clicks outside of the context menu
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [closeContextMenu]);
    console.log(options)
  

  return (
    <div 
      onClick={() => closeContextMenu()}
      className="absolute p-2 rounded-md" 
      style={{ top:y, left:x, backgroundColor: BG_DARK_PRIMARY }}

    >
      {options.map((tuple, index) => (
        <div className="cursor-pointer" key={ index } style={{ color:LIGHT_SECONDARY }} onClick={tuple[1]}>{tuple[0]}</div>
      ))
      }
    </div>
  );
}