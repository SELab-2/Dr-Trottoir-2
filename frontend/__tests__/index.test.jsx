import { render, screen } from "@testing-library/react";
import Login from "../src/pages/index";
import "@testing-library/jest-dom";

jest.mock("next/router", () => require("next-router-mock"));

describe("Home", () => {
  it("renders a heading", () => {
    render(<Login />);

    const el = screen.getByRole("button", {
      name: "Log in",
    });

    expect(el).toBeInTheDocument();
  });
});
