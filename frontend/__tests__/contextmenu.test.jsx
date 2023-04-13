import { render, screen, fireEvent } from "@testing-library/react";
import ContextMenu from "./ContextMenu";

test("Closes context menu when clicked outside", () => {
  const options = ["Option 1", "Option 2", "Option 3"];
  const closeContextMenu = jest.fn();
  render(
    <ContextMenu
      x={100}
      y={200}
      closeContextMenu={closeContextMenu}
      options={options}
    />
  );

  fireEvent.mouseDown(document);
  expect(closeContextMenu).toHaveBeenCalledTimes(1);
});

test("Closes context menu and returns selected option when option is clicked", () => {
  const options = ["Option 1", "Option 2", "Option 3"];
  const selectedOption = options[1];
  const closeContextMenu = jest.fn();

  render(
    <ContextMenu
      x={100}
      y={200}
      closeContextMenu={closeContextMenu}
      options={options}
    />
  );

  const contextMenuOptions = screen.getAllByRole("menuitem");
  const selectedOptionElement = contextMenuOptions[1];

  fireEvent.click(selectedOptionElement);
  expect(closeContextMenu).toHaveBeenCalledTimes(1);
  expect(closeContextMenu).toHaveBeenCalledWith(selectedOption);
});
