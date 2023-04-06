import {useEffect} from "react";
import ProgressBar from "react-customizable-progressbar";
import CustomProgressBar from "@/components/ProgressBar";

export default function CustomTable({ header, data }) {


  useEffect(() => {
        const loadData = () => {

        }
        loadData();
    }, []);

  return (
    <table className={"w-4/6"}>
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
        <tr className={"relative overflow-visible"}>
          <th>Test</th>
          <th
            className={
              " active:bg-light-bg-1 overflow-hidden max-w-0 active:max-w-none active:overflow-visible"
            }
          >
            Test
          </th>
          <th
            className={
              "active:bg-light-bg-1 overflow-hidden max-h-0 max-w-0 active:max-w-none active:max-h-none active:overflow-visible"
            }
          >
            <p className={"flex"}>Testfffffffffffffffffffffffffffffffffffffffffffffff fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff ffffff fffffffffff fffffffffffff fffffffffff fffffffffff ffffffffffffffffffffffffffffff</p>
          </th>
          <th
            id={"test"}
            className={
              "place-content-stretch active:bg-light-bg-2 overflow-hidden max-w-0 active:max-w-none active:overflow-visible"
            }
          >
            <CustomProgressBar fraction={0.8} />
          </th>
          <th>Test</th>
        </tr>
      </tbody>
    </table>
  );
}

//<th id={"test"} className={"absolute bg-light-bg-1"}>Testfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</th>