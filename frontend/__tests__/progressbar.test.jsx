import CustomProgressBar from "@/components/ProgressBar";

test('CustomProgressBar returns the correct color and percentage', () => {
  let finishedCount = 2;
  let amount = 10;
  const wheel = false;
  let expectedPercentage = 20;
  let expectedColor = "var(--color-low)";

  let result = CustomProgressBar({finishedCount, amount, wheel});

  expect(result.props.children.props.style.width).toBe(`${expectedPercentage}%`);
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);

  finishedCount = 4;
  expectedPercentage = 40;
  expectedColor = "var(--color-average)";

  result = CustomProgressBar({finishedCount, amount, wheel});

  expect(result.props.children.props.style.width).toBe(`${expectedPercentage}%`);
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);

  finishedCount = 7;
  expectedPercentage = 70;
  expectedColor = "var(--color-high)";

  result = CustomProgressBar({finishedCount, amount, wheel});

  expect(result.props.children.props.style.width).toBe(`${expectedPercentage}%`);
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);

  finishedCount = 10;
  expectedPercentage = 100;
  expectedColor = "var(--color-done)";

  result = CustomProgressBar({finishedCount, amount, wheel});

  expect(result.props.children.props.style.width).toBe(`${expectedPercentage}%`);
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);

  finishedCount = 10;
  amount = 5;
  expectedPercentage = 0;
  expectedColor = "var(--color-low)";

  result = CustomProgressBar({finishedCount, amount, wheel});

  expect(result.props.children.props.style.width).toBe(`${expectedPercentage}%`);
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);

  finishedCount = -5;
  amount = 10;
  expectedPercentage = 0;
  expectedColor = "var(--color-low)";

  result = CustomProgressBar({finishedCount, amount, wheel});

  expect(result.props.children.props.style.width).toBe(`${expectedPercentage}%`);
  expect(result.props.children.props.style.backgroundColor).toBe(expectedColor);
});