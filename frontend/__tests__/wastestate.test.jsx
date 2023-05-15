import WasteState from "@/components/forms/forms-components/forms-input/WasteState";
import { render, fireEvent } from "@testing-library/react";

describe("WasteState component", () => {
  test("renders without errors", () => {
    render(<WasteState />);
  });

  test("changes state when clicked", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <WasteState state={0} onChange={onChangeMock} editable={true} />
    );
    const component = getByTestId("waste-state-component");
    fireEvent.click(component);
    expect(onChangeMock).toHaveBeenCalledTimes(1);

    // Check if state and timesChanged values are updated correctly
    expect(onChangeMock.mock.calls[0][0]).toBe(1); // newState
    expect(onChangeMock.mock.calls[0][1]).toBe(1); // timesChanged
  });

  test("does not change state when not editable", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <WasteState state={1} onChange={onChangeMock} editable={false} />
    );
    const component = getByTestId("waste-state-component");
    fireEvent.click(component);
    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
