import Navbar from "@/components/navbar/Navbar";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next-auth/react");
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { first_name: "Michiel", last_name: "Lachaert" },
  };
  return {
    __esModule: true,
    ...originalModule,
    getSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

test("User info visible", async () => {
  render(<Navbar />);

  screen.getByText(/Michiel/i, {});
  screen.getByText(/Lachaert/i, {});
});

test("Direction press Dashboard", async () => {
  render(<Navbar />);

  const link = screen.getByRole("link", { name: "Planning" });
  expect(link).toBeInTheDocument();

  expect(link).toHaveAttribute("href", "/student/planning");
});
