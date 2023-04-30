import VisitService from "@/services/visit.service";
import PhotoService from "@/services/photo.service";

/**
 * We put all the photos of state departure of a visit in a list and return it.
 * @param url The url of the visit object.
 * @return list The list of photos with state departure.
 */
export default async function visit_finished(url) {
  const split = url.trim().split("/");
  const photoUrls = await VisitService.getPhotosByVisit(
    split[split.length - 2]
  );

  const photos = await Promise.all(
    photoUrls.map(async (entry) => {
      return await PhotoService.getEntryByUrl(entry.url);
    })
  );

  return photos.filter((entry) => entry["state"] === 2);
}
