import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Function to create clickable blinking icon
const createBlinkingIcon = (name, city) =>
  L.divIcon({
    className: "custom-blink-marker",
    html: `
      <div class="relative flex flex-col items-center -mt-10 select-none cursor-pointer">
        <!-- Info Box -->
        <div class="bg-white shadow-lg border border-gray-300 rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <div class="flex items-center justify-center">
            <img class="h-5 w-5" src="/nespak-logo.png" />
          </div>
          <div class="flex flex-col leading-tight">
            <span class="font-semibold text-[12px] whitespace-nowrap text-gray-800">${name}</span>
            <span class="text-[10px] capitalize text-gray-500">${city}</span>
          </div>
        </div>

        <!-- Blinking Marker -->
        <div class="relative mt-3">
          <div class="absolute w-8 h-8 bg-blue-400 rounded-full opacity-75 animate-ping"></div>
          <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
  });

const MapView = () => {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();

  // Fetch cameras from API
  const fetchCameras = async () => {
    try {
      const res = await fetch(`${API_URL}/camera`);
      const data = await res.json();
      setCameras(data.cameras || []);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[31.45, 74.3]}
        zoom={10}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {cameras.map((camera) => (
          <Marker
            key={camera._id}
            position={[camera.coordinates.lat, camera.coordinates.lng]}
            icon={createBlinkingIcon(camera.location, camera.status)}
            eventHandlers={{
              click: () => navigate(`/camera/${camera._id}`),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
