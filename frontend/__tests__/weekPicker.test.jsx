import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {CustomDayPicker, CustomWeekPicker} from "@/components/CustomWeekPicker";
import moment from "moment";

test("Test week picker is correctly formatted", async () => {
  render(<CustomWeekPicker />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, {
      target: { value: "06/04/2023 - 06/04/2023" },
    });
  });
  const date = new Date();
  expect(inputField.value).toBe("06/04/2023 - 06/04/2023");
});

test("Correct value is being stored in input of day picker", async () => {
  render(<CustomDayPicker />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(inputField.value).toBe("03/03/2023");
});

test("Check value is being parsed without error", async () => {
  render(<CustomWeekPicker />);
  const inputField = screen.getByRole("textbox", { name: "" });
  console.log(inputField.value);
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(inputField.value).toBe("2023-03-03");
});