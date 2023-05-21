import React from "react";
import { render } from "@testing-library/react";
import PieChart from "@/components/PieChart.jsx";
import "@testing-library/jest-dom";

test("renders the correct number of segments", () => {
  const fractions = [0.2, 0.3, 0.5];
  const circleWidth = 200;
  const radius = 50;
  const { container } = render(
    <PieChart fractions={fractions} circleWidth={circleWidth} radius={radius} />
  );
  const segments = container.querySelectorAll("circle");
  expect(segments.length).toBe(fractions.length);
});

test("renders each segment with the correct stroke color", () => {
  const fractions = [0.2, 0.3, 0.5];
  const circleWidth = 200;
  const radius = 50;
  const { container } = render(
    <PieChart fractions={fractions} circleWidth={circleWidth} radius={radius} />
  );
  const segments = container.querySelectorAll("circle");
  expect(segments[0]).toHaveStyle("stroke: var(--color-bad-1)");
  expect(segments[1]).toHaveStyle("stroke: var(--color-meh-1)");
  expect(segments[2]).toHaveStyle("stroke: var(--color-done-1)");
});

test("renders each segment with the correct rotation", () => {
  const fractions = [0.2, 0.3, 0.5];
  const circleWidth = 200;
  const radius = 50;
  const { container } = render(
    <PieChart fractions={fractions} circleWidth={circleWidth} radius={radius} />
  );
  const segments = container.querySelectorAll("circle");
  expect(segments[0]).toHaveAttribute("transform", "rotate(-90 100 100)");
  expect(segments[1]).toHaveAttribute("transform", "rotate(-18 100 100)");
  expect(segments[2]).toHaveAttribute("transform", "rotate(90 100 100)");
});