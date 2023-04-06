import { useEffect } from "react";
import ProgressBar from "react-customizable-progressbar";
import CustomProgressBar from "@/components/ProgressBar";

function Cell({ Component }) {
  return <div className={"max-h-6 w-full overflow-x-hidden overflow-hidden hover:max-h-none"}>{Component}</div>;
}

export default function CustomTable({ header, data }) {
  return (
    <table className={"w-full"}>
      <tbody>
        <tr className={"bg-accent-1"}>
          <th className={"rounded-l-full"}>Nr.</th>
          {header.map((entry, index) => {
            if (index + 1 === header.length) {
              return (
                <th className={"rounded-r-full"} key={entry}>
                  {entry}
                </th>
              );
            } else {
              return <th key={entry}>{entry}</th>;
            }
          })}
        </tr>
        <tr className={"p-6"}>
          <th>
            <Cell Component={"Test"} />
          </th>
          <th>
            <Cell Component={"Test"} />
          </th>
          <th>
            <Cell
              Component={
                <p>
                  Testfffffffffffffffffffffffffffffffffffffffffffffff
                  fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                  ffffff fffffffffff fffffffffffff fffffffffff fffffffffff
                  ffffffffffffffffffffffffffffff
                </p>
              }
            />
          </th>
          <th id={"test"}>
            <CustomProgressBar fraction={0.8} />
          </th>
          <th>Test</th>
        </tr>
      </tbody>
    </table>
  );
}

//<th id={"test"} className={"absolute bg-light-bg-1"}>Testfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</th>
