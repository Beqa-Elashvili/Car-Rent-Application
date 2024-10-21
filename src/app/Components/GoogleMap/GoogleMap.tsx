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
import { Button } from "antd";
import { FaMapMarkedAlt } from "react-icons/fa";

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
    <div className="flex flex-col gap-2 text-white">
      <div className="flex gap-2 items-center text-2xl">
        <FaMapMarkedAlt className="text-yellow-500" />
        <h1> Add your Current Position</h1>
      </div>
      {CurrentPosition && (
        <MapContainer
          center={CurrentPosition}
          zoom={10}
          scrollWheelZoom={false}
          style={{ width: "500px", height: "400px", borderRadius: 4 }}
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
      <Button
        onClick={() => setClickedPosition(CurrentPosition)}
        className="border-none text-white rounded-xl p-2 bg-blue-400 font-medium"
      >
        RESET
      </Button>
    </div>
  );
}
