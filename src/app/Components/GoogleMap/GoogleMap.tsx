"use client";

import React, { useEffect, useState } from "react";
import { useGlobalProvider } from "@/app/Providers/GlobalProvider";
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
import axios from "axios";

export default function OpenStreetMap() {
  const { setLocation } = useGlobalProvider();

  const [clickedPosition, setClickedPosition] = useState<
    [number, number] | null
  >(null);
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  const fetchLocationData = async (lat: number, lon: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data) {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          null;
        const street = data.address.road || null;

        setLocation({
          city: city,
          street: street,
        });
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  useEffect(() => {
    if (clickedPosition) {
      fetchLocationData(clickedPosition[0], clickedPosition[1]);
    }
  }, [clickedPosition]);

  useEffect(() => {
    if (currentPosition) {
      fetchLocationData(currentPosition[0], currentPosition[1]);
    }
  }, [currentPosition]);

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
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="flex flex-col gap-2 text-white">
      {currentPosition && (
        <MapContainer
          center={currentPosition}
          zoom={10}
          scrollWheelZoom={false}
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            borderRadius: 4,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clickedPosition ? (
            <Marker position={clickedPosition} icon={DefaultIcon}>
              <Popup>
                You clicked here: {clickedPosition[0].toFixed(4)},{" "}
                {clickedPosition[1].toFixed(4)}
              </Popup>
            </Marker>
          ) : (
            <Marker position={currentPosition} icon={DefaultIcon}>
              <Popup>
                You are here: {currentPosition[0].toFixed(4)},{" "}
                {currentPosition[1].toFixed(4)}
              </Popup>
            </Marker>
          )}
          <LocationMarker />
        </MapContainer>
      )}

      <Button
        onClick={() => setClickedPosition(currentPosition)}
        className="border-none text-white rounded-xl p-2 bg-blue-400 font-medium"
      >
        RESET
      </Button>
    </div>
  );
}
