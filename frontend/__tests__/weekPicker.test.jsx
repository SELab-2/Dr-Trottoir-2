import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CustomWeekPicker from "@/components/input-fields/CustomWeekPicker";

test("Test week picker is correctly formatted", async () => {
  const click = jest.fn();

  render(<CustomWeekPicker onChange={click} />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, {
      target: { value: "06/04/2023 - 06/04/2023" },
    });
  });
  expect(inputField.value).toBe("06/04/2023 - 06/04/2023");
});

test("Check value is being parsed without error", async () => {
  const click = jest.fn();

  render(<CustomWeekPicker onChange={click} />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(inputField.value).toBe("2023-03-03");
});

test("onChange gives back te correct value", async () => {
  let startDate;
  let endDate;
  const click = (newStartDate, newEndDate) => {
    startDate = newStartDate;
    endDate = newEndDate;
  };

  render(<CustomWeekPicker onChange={click} />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });

  expect(startDate.toLocaleDateString()).toBe(
    new Date("2023-02-27").toLocaleDateString()
  );
  expect(endDate.toLocaleDateString()).toBe(
    new Date("2023-03-05").toLocaleDateString()
  );
});
