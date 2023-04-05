import { fireEvent, render, screen } from "@testing-library/react";
import SelectionList from "@/components/SelectionList";
import CustomInputField from "@/components/InputField";
import { useRef } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

test("Test if input works and callback is called on click", () => {
  const handleClick = jest.fn();

  const view = render(
    <CustomInputField
      callback={handleClick}
      icon={faMagnifyingGlass}
    />
  );
  const inputField = screen.getByRole("textbox", { name: "" });
  const button = view.queryByTestId("input-button");
  fireEvent.change(inputField, { target: { value: "$23.0" } });
  fireEvent.click(button);
  expect(inputField.value).toBe("$23.0");
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("Button does not have to be present", () => {
  const view = render(<CustomInputField callback={() => {}} />);
  const button = view.queryByTestId("input-button");
  expect(button).toBe(null);
});
