import { act, render, screen, waitFor } from "@testing-library/react";
import Dropdown from "@/components/Dropdown";
import "@testing-library/jest-dom";
import Login from "@/pages";

describe("Dropdown", () => {
  it("Test multiple selection", async () => {
    let list = [];
    const handleClick = (l) => {
      list = l;
    };

    render(
      <Dropdown
        multi={true}
        onClick={handleClick}
        options={["option 1", "option 2"]}
      >
        <p>Button</p>
      </Dropdown>
    );

    // open dropdown
    await act(() => {
      const button = screen.getByRole("button", { name: "Button" });
      expect(button).toBeInTheDocument();
      button.click();
    });

    // click 1 option
    await act(() => {
      const el1 = screen.getByText("option 1", {});
      el1.click();
    });

    //click second option
    await act(() => {
      const el2 = screen.getByText("option 2", {});
      el2.click();
    });

    expect(list.length).toBe(2);
  });

  it("Test single selection", async () => {
    let list = [];
    const handleClick = (l) => {
      list = l;
    };

    render(
      <Dropdown
        multi={false}
        onClick={handleClick}
        options={["option 1", "option 2"]}
      >
        <p>Button</p>
      </Dropdown>
    );

    // open dropdown
    await act(() => {
      const button = screen.getByRole("button", { name: "Button" });
      expect(button).toBeInTheDocument();
      button.click();
    });

    // click 1 option
    await act(() => {
      const el1 = screen.getByText("option 1", {});
      el1.click();
    });

    //click second option
    await act(() => {
      const el2 = screen.getByText("option 2", {});
      el2.click();
    });

    expect(list.length).toBe(1);
  });
});
