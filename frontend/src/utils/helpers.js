import visitService from "@/services/visit.service";
import { urlToPK } from "@/utils/urlToPK";

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

export async function checkVisitPhotos(url) {
  const photos = await visitService.getPhotosByVisit(urlToPK(url));
  let arrival = false;
  let departure = false;
  let inside = false;
  let latest = null;
  for (let i in photos) {
    let photo = photos[i];
    let state = photo.state;
    const date = new Date(photo.created_at);
    if (latest === null || latest < date) {
      latest = date;
    }
    if (state === 1) {
      arrival = true;
    } else if (state === 2) {
      departure = true;
    } else if (state === 3) {
      inside = true;
    }
  }
  if (arrival && inside && inside) {
    return latest;
  }
  return null;
}
