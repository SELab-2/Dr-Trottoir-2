import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

/**
 * A calendar where you select a day.
 * @param date Date selected in the datePicker.
 * @param className Classes added to the component.
 * @param onChange Called when the date changes. this functions has following format: (date) => ();
 * @returns {JSX.Element}
 * @constructor
 *
 * @example
 * const [date, setDate] = useState(new Date());
 *
 * return (
 *   <div>
 *     <CustomDayPicker
 *       date={date}
 *       onChange={(date) => setDate(date)}
 *     />
 *   </div>
 * );
 */
export default function CustomDayPicker({ date, onChange, className }) {
  return (
    <DatePicker
      selected={date}
      onChange={(date) => onChange(date)}
      dateFormat="dd/MM/yyyy"
      calendarStartDay={1}
      className={`rounded-lg p-2 border-2 border-light-h-2 bg-light-bg-2 ${className}`}
    />
  );
}
