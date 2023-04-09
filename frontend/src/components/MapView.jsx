/*
 * Component for a google maps embed, view documentation at https://developers.google.com/maps/documentation/embed/embedding-map
 * mode can be "driving", "walking", "bicycling", "transit", "flying"
 */

import React from "react";
import PrimaryCard from "./custom-card/PrimaryCard";

function buildUrl(address, route, mode) {
  console.log(route);

  let map_type = "";
  let params = "";
  if (address !== undefined) {
    map_type = "place";
    params += "&q=" + encodeURIComponent(address);
  } else if (route !== undefined) {
    map_type = "directions";
    params += "&origin=" + encodeURIComponent(route[0]);
    if (route.length >= 3) {
      params += "&waypoints=";
      for (let i = 1; i < route.length - 1; i++) {
        params += encodeURIComponent(route[i]);
        if (i < route.length - 2) {
          params += "|";
        }
      }
    }
    params += "&destination=" + encodeURIComponent(route[route.length - 1]);
  }

  if (mode !== undefined) {
    params += "&mode=" + mode;
  }

  return (
    "https://www.google.com/maps/embed/v1/" +
    map_type +
    "?key=" +
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY +
    params
  );
}

export default function MapView({ address, route, mode }) {
  if (address === undefined && (route === undefined || route.length < 2)) {
    return (
      <PrimaryCard>
        <p>invalid map</p>
      </PrimaryCard>
    );
  }

  return (
    <PrimaryCard>
      <iframe
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={buildUrl(address, route, mode)}
      />
    </PrimaryCard>
  );
}
