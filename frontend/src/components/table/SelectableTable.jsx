import Cell from "@/components/table/Cell";
import { useEffect, useState } from "react";

export default function SelectableTable({
  columns,
  data,
  rightClick,
  clearSelected,
  className,
}) {
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState(null);

  useEffect(() => {
    if (clearSelected) {
      setSelectedIndices(new Set());
    }
  }, [clearSelected]);

  const addSelected = (event, index) => {
    const updatedIndiches = new Set(selectedIndices);
    if (event.ctrlKey) {
      // Add selected row with CTRL key
      if (updatedIndiches.has(index)) {
        updatedIndiches.delete(index);
      } else {
        updatedIndiches.add(index);
        setLastClickedIndex(index);
      }
    } else if (event.shiftKey && lastClickedIndex != null) {
      // Add consecutive selected rows with SHIFT key
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      for (let i = start; i <= end; i++) {
        updatedIndiches.add(i);
      }
      setLastClickedIndex(index);
    } else {
      if (updatedIndiches.size == 1 && updatedIndiches.has(index)) {
        updatedIndiches.delete(index);
      } else {
        updatedIndiches.clear(index);
        updatedIndiches.add(index);
        setLastClickedIndex(index);
      }
    }
    setSelectedIndices(updatedIndiches);
  };

  const handleRightClick = (event, index) => {
    const updatedIndiches = new Set(selectedIndices);
    updatedIndiches.add(index);
    setSelectedIndices(updatedIndiches);
    rightClick(event, Array.from(updatedIndiches));
  };

  return (
    <table className={`${className}`}>
      <thead>
        <tr className={"text-accent-2"}>
          <th className={"bg-accent-1 rounded-l-lg"}></th>
          {columns.map((entry, index) => {
            return (
              <th
                key={index}
                className={"last:rounded-lg p-1 text-left bg-accent-1"}
              >
                {entry.name}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            onClick={(event) => addSelected(event, index)}
            onContextMenu={(event) => handleRightClick(event, index)}
            className={`${
              selectedIndices.has(index)
                ? "bg-primary-2 text-selected-h"
                : "hover:bg-light-bg-2"
            }`}
          >
            <td className="rounded-l-lg">
              <div className={"w-10 text-center"}>{index}.</div>
            </td>
            {row.map((cell, cellIndex) => {
              const column = columns[cellIndex];

              return (
                <td key={cellIndex} className="last:rounded-r-lg">
                  <Cell cut={column.cut}>
                    {column.createCell ? column.createCell(cell) : cell}
                  </Cell>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
