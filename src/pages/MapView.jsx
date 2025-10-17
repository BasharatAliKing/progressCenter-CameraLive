import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Coordinates for two projects
const PROJECTS = [
  { name: "Neela Gumbad", city: "Lahore", lat: 31.5794, lon: 74.3086 },
  { name: "LDA City Underpass", city: "Lahore", lat: 31.35005048022089, lon: 74.27630898094678 },
];
const createBlinkingIcon = (name, city) =>
  L.divIcon({
    className: "custom-blink-marker",
    html: `
      <div class="relative flex flex-col items-center -mt-10 select-none">
        
        <!-- Info Box -->
        <div class="bg-white shadow-lg border border-gray-300 rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <!-- Icon -->
          <div class="flex items-center justify-center">
            <img class="h-5 w-5" src="/nespak-logo.png" />
          </div>

          <!-- Text -->
          <div class="flex flex-col leading-tight">
            <span class="font-semibold text-[12px] whitespace-nowrap text-gray-800">${name}</span>
            <span class="text-[8px] text-gray-500">${city}</span>
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
  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[31.45, 74.3]}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {PROJECTS.map((p, i) => (
          <Marker
            key={i}
            position={[p.lat, p.lon]}
            icon={createBlinkingIcon(p.name, p.city)}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
