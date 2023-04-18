import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

/**
 * A calendar where you select a day.
 * @param className Classes added to the component.
 * @param onChange Called when the date changes. this functions has following format: (date) => ();
 * @returns {JSX.Element}
 * @constructor
 */
export default function CustomDayPicker({ className, onChange }) {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        onChange(date);
      }}
      dateFormat="dd/MM/yyyy"
      calendarStartDay={1}
      className={`rounded-full p-2 border-2 border-light-h-2 bg-light-bg-2 ${className}`}
    />
  );
}
