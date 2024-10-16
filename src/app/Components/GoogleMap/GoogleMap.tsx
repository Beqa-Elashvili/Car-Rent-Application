"use client";
import React, { useState } from "react";
import { randomIconUrl } from ".";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export function GoogleMap() {
  const [clickedPosition, setClickedPosition] = useState<
    [number, number] | null
  >(null);
  const defaultPosition: [number, number] = [52.54, 10];

//   function LocationMarker() {
//     const [position, setPosition] = useState(null);
//     const map = useMapEvents({
//       click() {
//         map.locate();
//       },
//       locationfound(e: any) {
//         setPosition(e.latlng);
//         map.flyTo(e.latlng, map.getZoom());
//       },
//     });

      function LocationMarker() {
        const [position, setPosition] = useState(null);
        const map = useMapEvents({
          click(e) {
            // Set the clicked position
            setClickedPosition([e.latlng.lat, e.latlng.lng]);
            // Optional: Fly to clicked position
            map.flyTo(e.latlng, map.getZoom());
          },
          locationfound(e: any) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
          },
        });

    return position === null ? null : (
      <Marker position={position} icon={DefaultIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  const DefaultIcon = L.icon({
    iconUrl: randomIconUrl,
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div>
      <MapContainer
        center={defaultPosition}
        zoom={10}
        scrollWheelZoom={false}
        style={{ width: "500px", height: "200px", borderRadius: 4 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=d3k12FZaz83jdLUdUwqb"
        />
        {clickedPosition && (
          <Marker position={clickedPosition} icon={DefaultIcon}>
            <Popup>
              You clicked here: {clickedPosition[0].toFixed(4)},{" "}
              {clickedPosition[1].toFixed(4)}
            </Popup>
          </Marker>
        )}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
