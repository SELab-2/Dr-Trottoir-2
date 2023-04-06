import moment from "moment";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export function CustomWeekPicker() {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const handleValueChange = (newValue) => {
    const value = newValue[0];
    if (value !== null) {
      const dateFrom = moment(value).startOf("isoWeek").toDate();
      const dateTo = moment(value).endOf("isoWeek").toDate();
      setDateRange([dateFrom, dateTo]);
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
      className={
        "rounded-full w-1/6 p-2 border-2 border-light-h-2 bg-light-bg-2"
      }
    />
  );
}

export function CustomDayPicker() {
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
