import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {CustomDayPicker, CustomWeekPicker} from "@/components/CustomWeekPicker";
import moment from "moment";

test("Correct value is being stored in input of week picker", async () => {
  const changeData = jest.fn();
  render(<CustomWeekPicker callback={changeData} />);
  const inputField = screen.getByTestId("week");
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-W17" } });
  });
  expect(changeData).toHaveBeenCalledTimes(1);
  expect(inputField.value).toBe("2023-W17");
});

test("Correct value is being returned by callback", async () => {
  let date = null;
  const changeData = (data) => {
    date = data;
  };
  render(<CustomWeekPicker callback={changeData} />);
  const inputField = screen.getByTestId("week");
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-W17" } });
  });
  const value = inputField.value;
  const dateFrom = moment(value).startOf("isoWeek").format("yyyy-MM-DD");
  const dateTo = moment(value).endOf("isoWeek").format("yyyy-MM-DD");
  expect(dateFrom).toBe(date.startDate);
  expect(dateTo).toBe(date.endDate);
});

test("Correct value is being stored in input of day picker", async () => {
  render(<CustomDayPicker />);
  const inputField = screen.getByTestId("day");
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(inputField.value).toBe("2023-03-03");
});