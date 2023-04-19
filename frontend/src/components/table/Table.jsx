import Cell from "@/components/table/Cell";

export default function CustomTable({ columns, data, className }) {
  return (
    <table className={`${className}`}>
      <thead>
        <tr className={"text-accent-2"}>
          <th className={"rounded-l-lg bg-accent-1"}></th>
          {columns.map((entry, index) => {
            return (
              <th
                key={index}
                className={"last:rounded-r-lg p-1 text-left bg-accent-1"}
              >
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
              <div className={"w-10 text-center"}>{index + 1}.</div>
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
