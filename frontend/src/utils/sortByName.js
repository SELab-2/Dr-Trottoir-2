export default function sortByName(arr) {
  return arr.sort((a, b) => {
    const aName = a.name;
    const bName = b.name;
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
}