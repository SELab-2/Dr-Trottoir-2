import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

test("calls handle function on button press in PrimaryButton component", async () => {
  const handleClick = jest.fn();
  render(
    <PrimaryButton icon={faCirclePlus} text={"click me"} handle={handleClick} />
  );
  const button = screen.getByRole("button", { name: /click me/i });
  await waitFor(() => {
    fireEvent.click(button);
  });
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("calls handle function on button press in SecondaryButton component", async () => {
  const handleClick = jest.fn();
  render(
    <SecondaryButton
      icon={faCirclePlus}
      text={"click me"}
      handle={handleClick}
    />
  );
  const button = screen.getByRole("button", { name: /click me/i });
  await waitFor(() => {
    fireEvent.click(button);
  });
  expect(handleClick).toHaveBeenCalledTimes(1);
});
