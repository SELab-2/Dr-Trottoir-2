import TableWasteSchedule from "@/components/forms/forms-components/forms-input/TableWasteSchedule";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import moment from "moment";

test("TableWasteSchedule displays correct waste schedule", () => {
  const buildings = [
    { building: { nickname: "Building 1", url: "building1" } },
    { building: { nickname: "Building 2", url: "building2" } },
  ];

  const wasteSchedule = {
    building1: [
      { date: "2023-05-16", waste_type: "Rest", action: "Binnen" },
      { date: "2023-05-16", waste_type: "PMD", action: "Buiten" },
    ],
    building2: [
      { date: "2023-05-16", waste_type: "Rest", action: "Binnen" },
      { date: "2023-05-16", waste_type: "Glas", action: "Binnen" },
    ],
  };

  const onChange = jest.fn();

  render(
    <TableWasteSchedule
      buildings={buildings}
      wasteSchedule={wasteSchedule}
      onChange={onChange}
    />
  );

  // Verify that the waste types are displayed correctly
  expect(screen.getByText("Rest")).toBeInTheDocument();
  expect(screen.getByText("PMD")).toBeInTheDocument();
  expect(screen.getByText("Glas")).toBeInTheDocument();

  // Verify that the building names are displayed correctly
  expect(screen.getByText("Building 1")).toBeInTheDocument();
  expect(screen.getByText("Building 2")).toBeInTheDocument();
});

test("TableWasteSchedule calls onChange with correct modified wastes", () => {
  const buildings = [
    { building: { nickname: "Building 1", url: "building1" } },
    { building: { nickname: "Building 2", url: "building2" } },
  ];

  const wasteSchedule = {
    building1: [],
    building2: [],
  };

  const onChange = jest.fn();

  render(
    <TableWasteSchedule
      buildings={buildings}
      wasteSchedule={wasteSchedule}
      onChange={onChange}
    />
  );

  // Select a waste state for another building and day
  fireEvent.click(screen.getAllByTestId("waste-state-component")[0]);

  // Verify that onChange is called with the modified wastes
  expect(onChange).toHaveBeenCalled();
});

test("TableWasteSchedule does not allow editing when editable is false", () => {
  const buildings = [
    { building: { nickname: "Building 1", url: "building1" } },
    { building: { nickname: "Building 2", url: "building2" } },
  ];

  const wasteSchedule = {
    building1: [
      { date: "2023-05-16", waste_type: "Rest", action: "Binnen" },
      { date: "2023-05-16", waste_type: "PMD", action: "Buiten" },
    ],
    building2: [
      { date: "2023-05-16", waste_type: "Rest", action: "Binnen" },
      { date: "2023-05-16", waste_type: "Glas", action: "Binnen" },
    ],
  };

  const startDate = moment("2023-05-15").toDate();
  const onChange = jest.fn();

  render(
    <TableWasteSchedule
      buildings={buildings}
      wasteSchedule={wasteSchedule}
      startDate={startDate}
      onChange={onChange}
      editable={false}
    />
  );


  fireEvent.click(screen.getAllByTestId("waste-state-component")[0]);

  // Verify that onChange is not called when waste states are clicked
  expect(onChange).not.toHaveBeenCalled();
});
