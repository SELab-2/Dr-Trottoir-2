import Layout from "@/components/Layout";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import axios from "axios";
jest.mock("axios");
jest.mock("next-auth/react");
jest.mock("next/router", () => require("next-router-mock"));

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    getSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

test("Layout includes the children", async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        first_name: "Michiel",
        last_name: "Lachaert",
      },
    ],
    status: 200,
  });

  await act(() => {
    render(
      <Layout>
        <div id={"test"}>
          <p>Dit is een tekst</p>
        </div>
      </Layout>
    );
  });

  const el = screen.getByRole("main", {});
  expect(el).toBeInTheDocument();
});
