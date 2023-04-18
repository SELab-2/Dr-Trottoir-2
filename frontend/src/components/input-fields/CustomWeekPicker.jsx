import moment from "moment";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

/**
 * A calendar where you select a whole week.
 * @param className Classes added to the component.
 * @param onChange Called when the date changes. this functions has following format: (startDate, endDate) => ();
 * @returns {JSX.Element}
 * @constructor
 */
export default function CustomWeekPicker({ className, onChange }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const handleValueChange = (newValue) => {
    const value = newValue[0];
    if (value !== null) {
      const dateFrom = moment(value).startOf("isoWeek").toDate();
      const dateTo = moment(value).endOf("isoWeek").toDate();
      setDateRange([dateFrom, dateTo]);
      onChange(dateFrom, dateTo);
    }
  };

  return (
    <DatePicker
      startDate={startDate}
      data-testid="week"
      endDate={endDate}
      dateFormat="dd/MM/yyyy"
      selectsRange={true}
      onChange={(date) => handleValueChange(date)}
      calendarStartDay={1}
      className={`rounded-full p-2 border-2 border-light-h-2 bg-light-bg-2 ${className}`}
    />
  );
}
