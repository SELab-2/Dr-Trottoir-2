//TODO: Just an example, to be deleted

import { render, screen } from "@testing-library/react";
import Login from "../src/pages/index";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";

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
