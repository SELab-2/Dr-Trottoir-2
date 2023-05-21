import { urlToPK } from "@/utils/urlToPK";

export default function filterTourByRecent(arr) {
  return arr.filter(
    (tour) =>
      !arr.some(
        (tour2) =>
          tour.name === tour2.name && urlToPK(tour.url) < urlToPK(tour2.url)
      )
  );
}
