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

  // determine type of embed: if it's a single address or a 'route' with length 1, a single pin is enough
  // otherwise, embed a route
  if (address !== undefined || (route !== undefined && route.length == 1)) {
    map_type = "place";
    params +=
      "&q=" + encodeURIComponent(address !== undefined ? address : route[0]);
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
  if (address === undefined && (route === undefined || route.length == 0)) {
    return (
      <iframe
        width="400"
        height="250"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={
          "https://www.google.com/maps/embed/v1/view?key=" +
          process.env.NEXT_PUBLIC_GOOGLE_API_KEY +
          "&center=50.5508573,4.3932513&zoom=8.75"
        }
      />
    );
  }

  return (
    <iframe
      width="400"
      height="250"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={buildUrl(address, route, mode)}
    />
  );
}
