import ContextMenu from "@/components/ContextMenu";
import { render, screen, fireEvent } from "@testing-library/react";

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

  fireEvent.click(document.documentElement);
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

  const contextMenuOptions = screen.getAllByText(/Option [1-3]/i);
  const selectedOptionElement = contextMenuOptions[1];

  fireEvent.click(selectedOptionElement);
  expect(closeContextMenu).toHaveBeenCalledWith(selectedOption);
});
