export const clamp = (lowerBound, number, upperBound) => {
  return number < lowerBound
    ? lowerBound
    : number > upperBound
    ? upperBound
    : number;
};
