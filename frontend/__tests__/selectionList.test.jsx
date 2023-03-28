import { BG_ACCENT } from "@/utils/colors";
import {
  fireEvent,
  queryAllByTestId,
  render,
  waitFor,
} from "@testing-library/react";
import SelectionList from "@/components/SelectionList";
import SmallTour from "@/components/SmallTour";

const tours = [
  {
    url: "http://127.0.0.1:8000/api/tour/1/",
    name: "Coupure",
    amount: 3,
    finished: 1,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/2/",
    name: "tour 1",
    amount: 2,
    finished: 1,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/3/",
    name: "tour 2",
    amount: 5,
    finished: 1,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/4/",
    name: "tour 3",
    amount: 7,
    finished: 5,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/5/",
    name: "tour 4",
    amount: 8,
    finished: 6,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/6/",
    name: "tour 5",
    amount: 9,
    finished: 7,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/7/",
    name: "tour 6",
    amount: 10,
    finished: 8,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/8/",
    name: "tour 7",
    amount: 5,
    finished: 5,
  },
  {
    url: "http://127.0.0.1:8000/api/tour/9/",
    name: "tour 8",
    amount: 12,
    finished: 9,
  },
];

test("Test if all SmallTour components are rendered", () => {
  const amount = tours.length;

  const view = render(
    <SelectionList
      elements={tours}
      title={"Rondes"}
      callback={() => {}}
      Component={({ url, background, setSelected, callback, data }) => (
        <SmallTour
          data-testid={"tour"}
          key={url}
          background={background}
          setSelected={setSelected}
          callback={callback}
          data={data}
        />
      )}
    />
  );
  const smallTours = view.queryAllByTestId("small-tour");
  expect(smallTours.length).toBe(amount);
});

test("Test if SmallTour components is selected on click", async () => {
  const handleClick = jest.fn();
  const background = BG_ACCENT;
  const view = render(
    <SelectionList
      elements={tours}
      title={"Rondes"}
      callback={handleClick}
      Component={({ url, background, setSelected, callback, data }) => (
        <SmallTour
          data-testid={"tour"}
          key={url}
          background={background}
          setSelected={setSelected}
          callback={callback}
          data={data}
        />
      )}
    />
  );
  const smallTour = view.queryAllByTestId("small-tour")[0];
  await waitFor(() => {
    fireEvent.click(smallTour);
  });
  expect(handleClick).toHaveBeenCalledTimes(1);
});
