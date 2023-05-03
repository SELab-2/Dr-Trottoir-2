import { useState } from "react";

export default function Cell({ children, cut }) {
  const [showFull, setShowFull] = useState(false);

  const cutClassNames = `max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer`;
  const showFullClassNames =
    "bg-primary-2 text-primary-1 border-primary-1 font-bold";

  return (
    <div className={""}>
      <div
        className={`p-1 rounded ${showFull ? showFullClassNames : ""} ${
          cut ? cutClassNames : ""
        }`}
        onClick={() => {
          if (cut) {
            setShowFull(!showFull);
          }
        }}
      >
        {children}
      </div>
      {cut && showFull && (
        <div
          className={
            "absolute z-100 bg-light-bg-1 border-2 rounded-b border-light-border rounded p-1 max-w-sm"
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}
