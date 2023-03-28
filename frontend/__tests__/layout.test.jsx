import Layout from "@/components/Layout";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("Layout includes the children", async () => {
  render(
    <Layout>
      <div id={"test"}>
        <p>Dit is een tekst</p>
      </div>
    </Layout>
  );

  const el = screen.getByRole("div", { id: "test" });
  expect(el).toBeInTheDocument();
});
