import "leaflet/dist/leaflet.css";
import "./LeafletMap.css";
import leaflet, { Map } from "leaflet";
import { useState, useEffect } from "react";
import { Stop } from "../interfaces";

function LeafletMap() {
  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [map, setMap] = useState<Map>();

  function getPosition() {
    if ("geolocation" in navigator && !position?.latitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  useEffect(() => {
    if (!position?.latitude) {
      getPosition();
    }
  }, []);

  useEffect(() => {
    if (position?.latitude && !map) {
      const myMap = leaflet
        .map("map")
        .setView([position?.latitude, position?.longitude], 15);

      setMap(myMap);
    }
  }, [position]);

  useEffect(() => {
    if (map && position) {
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      const marker = leaflet
        .marker([position?.latitude, position?.longitude])
        .addTo(map);

      marker.bindPopup("Här är du");
    }
  }, [map, position]);

  useEffect(() => {
    if (map) {
      async function getNearbyStops() {
        const response = await fetch(
          `https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${
            position?.latitude
          }&originCoordLong=${position?.longitude}&format=json&accessId=${
            import.meta.env.VITE_API_KEY
          }`
        );
        const { stopLocationOrCoordLocation } = await response.json();

        stopLocationOrCoordLocation.forEach((stop: Stop) => {
          const marker = leaflet
            .marker([stop.StopLocation.lat, stop.StopLocation.lon])
            .addTo(map);

            marker.bindTooltip(stop.StopLocation.name, { permanent: false, direction: 'top' });

          marker.on("click", async () => {
            const response = await fetch(
              `https://api.resrobot.se/v2.1/departureBoard?id=${
                stop.StopLocation.extId
              }&duration=10&format=json&accessId=${
                import.meta.env.VITE_API_KEY
              }`
            );
            const { Departure } = await response.json();
            let timetable = `<b>${stop.StopLocation.name}</b><br>`;
            if (Departure && Departure.length > 0) {
              Departure.forEach((departure) => {
                timetable += `${departure.time} - ${departure.name} (${departure.direction})<br>`;
              });
            } else {
              timetable += "No upcoming departures found.";
            }
            marker.bindPopup(timetable).openPopup();
          });
        });
      }

      getNearbyStops();
    }
  }, [map, position]);

  return <section id="map" style={{ height: "700px" }}></section>;
}

export default LeafletMap;
