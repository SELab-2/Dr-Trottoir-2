import CustomProgressBar from "@/components/ProgressBar";
import { MEH, GOOD, BAD, DONE } from "@/utils/colors";
const wheel = false;

test("CustomProgressBar returns the correct color for percentage under 33%", () => {
  const finishedCount = 2;
  const expectedPercentage = 20;
  const expectedColor = BAD;
  const amount = 10;

  let result = CustomProgressBar({ finishedCount, amount, wheel });

  expect(result.props.children.props.style.width).toBe(
    `${expectedPercentage}%`
  );
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});

test("CustomProgressBar returns the correct color for percentage between 33% and 66%", () => {
  const finishedCount = 4;
  const expectedPercentage = 40;
  const expectedColor = MEH;
  const amount = 10

  const result = CustomProgressBar({ finishedCount, amount, wheel });

  expect(result.props.children.props.style.width).toBe(
    `${expectedPercentage}%`
  );
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});

test("CustomProgressBar returns the correct color for percentage between 66% and 99%", () => {
  const finishedCount = 7;
  const expectedPercentage = 70;
  const expectedColor = GOOD;
  const amount = 10

  const result = CustomProgressBar({ finishedCount, amount, wheel });

  expect(result.props.children.props.style.width).toBe(
    `${expectedPercentage}%`
  );
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});

test("CustomProgressBar returns the correct color for percentage 100% completion", () => {
  const finishedCount = 10;
  const expectedPercentage = 100;
  const expectedColor = DONE;
  const amount = 10;

  const result = CustomProgressBar({ finishedCount, amount, wheel });

  expect(result.props.children.props.style.width).toBe(
    `${expectedPercentage}%`
  );
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});

test("CustomProgressBar gives 0% completion when actual percentage is higher than 100%", () => {
  const finishedCount = 10;
  const amount = 5;
  const expectedPercentage = 0;
  const expectedColor = BAD;

  const result = CustomProgressBar({ finishedCount, amount, wheel });

  expect(result.props.children.props.style.width).toBe(
    `${expectedPercentage}%`
  );
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});

test("CustomProgressBar gives 0% completion when actual percentage is lower than 0%", () => {
  const finishedCount = -5;
  const amount = 10;
  const expectedPercentage = 0;
  const expectedColor = BAD;

  const result = CustomProgressBar({ finishedCount, amount, wheel });

  expect(result.props.children.props.style.width).toBe(
    `${expectedPercentage}%`
  );
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});