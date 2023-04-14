import { useState } from "react";

export default function Cell({ children, cut }) {
  const [showFull, setShowFull] = useState(false);

  const cutClassNames =
    "max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap";

  return (
    <div className={"relative"}>
      <div
        className={`p-1 text-light-text ${cut ? cutClassNames : ""}`}
        onMouseOver={() => setShowFull(true)}
        onMouseOut={() => setShowFull(false)}
      >
        {children}
      </div>
      {cut && showFull && (
        <div
          className={
            "absolute z-10 left-0 top-0 bg-light-bg-2 border-b-2 border-r-2 border-l-2 p-1 pointer-events-none rounded-b-md"
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}
