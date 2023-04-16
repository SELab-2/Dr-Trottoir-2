import Cell from "@/components/table/Cell";

export default function CustomTable({ columns, data, className }) {
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
          <tr key={index}>
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
