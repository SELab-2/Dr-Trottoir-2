export const clamp = (lowerBound, number, upperBound) => {
  return number < lowerBound
    ? lowerBound
    : number > upperBound
    ? upperBound
    : number;
};

// https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
export const getMonday = (date) => {
  let day = date.getDay(),
    diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  date.setDate(diff);
  date.setHours(0, 0, 0, 0); // set hours to 00:00:00

  return date; // object is mutable no need to recreate object
};

export const getSunday = (date) => {
  let day = date.getDay(),
    diff = date.getDate() + (6 - day) + (day === 0 ? -6 : 1); // adjust when day is sunday
  date.setDate(diff);
  date.setHours(0, 0, 0, 0); // set hours to 00:00:00

  return date; // object is mutable no need to recreate object
};
