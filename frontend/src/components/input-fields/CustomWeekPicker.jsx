import moment from "moment";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomWeekPicker({ range }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  useEffect(() => {
    if (range[0] && range[1]) {
      setDateRange(range);
    }
  }, [range]);

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
      startDate={dateRange[0]}
      data-testid="week"
      endDate={dateRange[1]}
      dateFormat="dd/MM/yyyy"
      selectsRange={true}
      onChange={(date) => handleValueChange(date)}
      calendarStartDay={1}
      className={"rounded-full p-2 border-2 border-light-h-2 bg-light-bg-1"}
    />
  );
}
