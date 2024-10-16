"use client";
import React, { useEffect, useState } from "react";
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
  const [CurrentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
        },
        () => {
          console.error("Unable to retrieve your location.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setClickedPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return clickedPosition === null ? null : (
      <Marker position={clickedPosition} icon={DefaultIcon}>
        <Popup>You clicked here</Popup>
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
      {CurrentPosition && (
        <MapContainer
          center={CurrentPosition}
          zoom={10}
          scrollWheelZoom={false}
          style={{ width: "500px", height: "200px", borderRadius: 4 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=d3k12FZaz83jdLUdUwqb"
          />
          {clickedPosition ? (
            <Marker position={clickedPosition} icon={DefaultIcon}>
              <Popup>
                You clicked here: {clickedPosition[0].toFixed(4)},{" "}
                {clickedPosition[1].toFixed(4)}
              </Popup>
            </Marker>
          ) : (
            <Marker position={CurrentPosition} icon={DefaultIcon}>
              <Popup>
                You are here: {CurrentPosition[0].toFixed(4)},{" "}
                {CurrentPosition[1].toFixed(4)}
              </Popup>
            </Marker>
          )}
          <LocationMarker />
        </MapContainer>
      )}
    </div>
  );
}
