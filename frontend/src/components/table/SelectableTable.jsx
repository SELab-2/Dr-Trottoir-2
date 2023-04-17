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

  useEffect(() => {
    if (clearSelected) {
      setSelectedIndices(new Set());
    }
  }, [clearSelected]);

  const addSelected = (event, index) => {
    const updatedIndiches = new Set(selectedIndices);
    if (updatedIndiches.has(index)) {
      updatedIndiches.delete(index);
    } else {
      updatedIndiches.add(index);
    }
    setSelectedIndices(updatedIndiches);
  };

  const handleRightClick = (event, index) => {
    const updatedIndiches = new Set(selectedIndices);
    updatedIndiches.add(index);
    setSelectedIndices(updatedIndiches);
    rightClick(event, updatedIndiches);
  };

  return (
    <table className={`${className}`}>
      <thead>
        <tr className={"bg-accent-1 text-accent-2"}>
          <th className={"rounded-l-full"}></th>
          {columns.map((entry, index) => {
            return (
              <th key={index} className={"last:rounded-r-full p-1 text-left"}>
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
            <td>
              <div className={"w-10 text-center"}>{index}.</div>
            </td>
            {row.map((cell, cellIndex) => {
              const column = columns[cellIndex];

              return (
                <td key={cellIndex}>
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
