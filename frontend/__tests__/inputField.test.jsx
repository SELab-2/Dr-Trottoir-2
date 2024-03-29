import { fireEvent, render, screen } from "@testing-library/react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import CustomInputField from "@/components/input-fields/InputField";

test("Test if input works and callback is called on click", () => {
  const handleClick = jest.fn();

  const view = render(
    <CustomInputField iconCallback={handleClick} icon={faMagnifyingGlass} />
  );
  const inputField = screen.getByRole("textbox", { name: "" });
  const button = view.queryByTestId("input-button");
  fireEvent.change(inputField, { target: { value: "$23.0" } });
  fireEvent.click(button);
  expect(inputField.value).toBe("$23.0");
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("Test if input works and callback is called on enter", () => {
  const handleEnter = jest.fn();

  render(
    <CustomInputField keyDownCallback={handleEnter} />
  );
  const inputField = screen.getByRole("textbox", { name: "" });
  fireEvent.change(inputField, { target: { value: "abc" } });
  fireEvent.keyDown(inputField, { key: 'enter', keyCode: 13 })
  expect(inputField.value).toBe("abc");
  expect(handleEnter).toHaveBeenCalledTimes(1);
});

test("Test if input works and callback is called on either enter or icon click", () => {
  const handleClick = jest.fn();
  const handleEnter = jest.fn();
  const handleAction = jest.fn();

  const view = render(
    <CustomInputField
      iconCallback={handleClick}
      keyDownCallback={handleEnter}
      actionCallback={handleAction}
      icon={faMagnifyingGlass} />
  );
  const inputField = screen.getByRole("textbox", { name: "" });
  const button = view.queryByTestId("input-button");
  fireEvent.change(inputField, { target: { value: "abc" } });
  fireEvent.click(button);
  fireEvent.keyDown(inputField, { key: 'Enter', keyCode: 13 })
  expect(inputField.value).toBe("abc");
  expect(handleEnter).toHaveBeenCalledTimes(1);
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleAction).toHaveBeenCalledTimes(2);
});

test("Button does not have to be present", () => {
  const view = render(<CustomInputField callback={() => {}} />);
  const button = view.queryByTestId("input-button");
  expect(button).toBe(null);
});
