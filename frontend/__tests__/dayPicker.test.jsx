import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CustomDayPicker from "@/components/input-fields/CustomDayPicker";

test("Correct value is being stored in input of day picker", async () => {
  const click = jest.fn();

  render(<CustomDayPicker onChange={click} />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(inputField.value).toBe("03/03/2023");
});

test("onChange gives back te correct value", async () => {
  let date;
  const click = (newDate) => {
    date = newDate;
  };

  render(<CustomDayPicker onChange={click} />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(date.toLocaleDateString()).toBe(
    new Date("2023-03-03").toLocaleDateString()
  );
});
