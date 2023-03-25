import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {PrimaryButton} from "@/components/Button";
import {
	faCirclePlus,
} from '@fortawesome/free-solid-svg-icons'

test('calls handle function on button press', async () => {
  const handleClick = jest.fn();
  render(<PrimaryButton icon={faCirclePlus} text={"click me"} handle={handleClick}/>);
  const button = screen.getByRole('button', {name: /click me/i});
  await waitFor(() => {
    fireEvent.click(button);
  });
  expect(handleClick).toHaveBeenCalledTimes(1);
});