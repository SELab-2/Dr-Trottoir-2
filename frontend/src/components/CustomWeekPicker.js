import moment from "moment";

export function CustomWeekPicker({ callback }) {
  const handleValueChange = (newValue) => {
    const value = newValue.target.value;
    const dateFrom = moment(value).startOf("isoWeek").format("yyyy-MM-DD");
    const dateTo = moment(value).endOf("isoWeek").format("yyyy-MM-DD");

    callback({ startDate: dateFrom, endDate: dateTo });
  };

  return (
    <input
      type="week"
      name="week"
      data-testid="week"
      id="camp-week"
      className={
        "bg-light-bg-2 p-2 flex w-1/6 border-2 border-light-h-2 rounded-full"
      }
      onChange={handleValueChange}
    />
  );
}

export function CustomDayPicker() {
  return (
    <input
      type="date"
      name="day"
      data-testid="day"
      id="camp-day"
      className={
        "bg-light-bg-2 p-2 flex w-1/6 border-2 border-light-h-2 rounded-full"
      }
    />
  );
}
