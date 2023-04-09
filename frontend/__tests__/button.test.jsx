import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";

test("calls handle function on button press in PrimaryButton component", async () => {
  const handleClick = jest.fn();
  render(
    <PrimaryButton icon={faCirclePlus} onClick={handleClick}>
      <span>click me</span>
    </PrimaryButton>
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
      onClick={handleClick}
    >
      <span>click me</span>
    </SecondaryButton>
  );
  const button = screen.getByRole("button", { name: /click me/i });
  await waitFor(() => {
    fireEvent.click(button);
  });
  expect(handleClick).toHaveBeenCalledTimes(1);
});
