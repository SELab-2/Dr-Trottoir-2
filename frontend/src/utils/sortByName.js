export default function sortByName(arr, key = "name") {
  return arr.sort((a, b) => {
    const aName = a[key]?.toLowerCase();
    const bName = b[key]?.toLowerCase();
    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  });
}
