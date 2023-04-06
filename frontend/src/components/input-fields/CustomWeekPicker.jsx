import moment from "moment";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomWeekPicker() {
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