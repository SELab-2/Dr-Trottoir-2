import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CustomDayPicker from "@/components/input-fields/CustomDayPicker";

test("Correct value is being stored in input of day picker", async () => {
  render(<CustomDayPicker />);
  const inputField = screen.getByRole("textbox", { name: "" });
  await waitFor(() => {
    fireEvent.change(inputField, { target: { value: "2023-03-03" } });
  });
  expect(inputField.value).toBe("03/03/2023");
});
