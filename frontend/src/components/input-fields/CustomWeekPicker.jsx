import moment from "moment";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

/**
 * A calendar where you select a whole week.
 * @param startDate startDate of the week
 * @param endDate endDate of the week
 * @param className Classes added to the component.
 * @param onChange Called when the date changes. this functions has following format: (startDate, endDate) => ();
 * @returns {JSX.Element}
 * @constructor
 *
 * @example
 * const [startDate, setStartDate] = useState(getMonday(new Date()));
 * const [endDate, setEndDate] = useState(getSunday(new Date()));
 *
 * return (
 *   <div>
 *     <CustomWeekPicker
 *       startDate={startDate}
 *       endDate={endDate}
 *       onChange={(startDate, endDate) => {
 *         setStartDate(startDate);
 *         setEndDate(endDate);
 *       }}
 *     />
 *   </div>
 * );
 */
export default function CustomWeekPicker({
  startDate,
  endDate,
  className,
  onChange,
}) {
  // const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  //
  // useEffect(() => {
  //   if (startDate && endDate) {
  //     setDateRange([startDate, endDate]);
  //   }
  // }, [startDate, endDate]);

  const handleValueChange = (newValue) => {
    const value = newValue[0];
    if (value !== null) {
      const dateFrom = moment(value).startOf("isoWeek").toDate();
      const dateTo = moment(value).endOf("isoWeek").toDate();

      onChange(dateFrom, dateTo);
      //setDateRange([dateFrom, dateTo]);
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
