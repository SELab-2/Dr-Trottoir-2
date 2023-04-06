import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDayPicker() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="dd/MM/yyyy"
      calendarStartDay={1}
      className={
        "rounded-full w-1/6 p-2 border-2 border-light-h-2 bg-light-bg-2"
      }
    />
  );
}
