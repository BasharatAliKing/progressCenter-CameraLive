import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import "./mapStyles.css"; // custom CSS for blinking marker
import Sidebar from "../layouts/Sidebar";
import Navbar from "../layouts/Navbar";
import UserContext from "../useContexts/UserContext";
// Coordinates for map markers
const LOCATIONS = [
  {
    name: "Neela Gumbad",
    description: "Lahore",
    lat: 31.5681,
    lon: 74.3042,
  },
  {
    name: "LDA City Underpass",
    description: "Lahore",
    lat: 31.4523,
    lon: 74.4664,
  },
];

// Custom blinking green circle marker
const BlinkingIcon = L.divIcon({
  className: "custom-blink-marker",
  html: `
    <div class="relative flex flex-col items-center">
      <div class="ping-wrap">
        <div class="ping-ring"></div>
        <div class="ping-ring delay-1"></div>
        <div class="ping-center"></div>
      </div>
    </div>
  `,
  iconSize: [0, 0],
});

const Dashboard = () => {
   const { cameras } = useContext(UserContext);
  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Map Section */}
        <div className="flex-1 relative">
          <MapContainer
            center={[31.45, 74.35]}
            zoom={7}
            scrollWheelZoom
            className="h-full w-full z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Markers */}
            {LOCATIONS.map((loc, idx) => (
              <Marker
                key={idx}
                position={[loc.lat, loc.lon]}
                icon={BlinkingIcon}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-gray-600">{loc.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* View filter panel */}
          <div className="absolute top-20 right-6 flex space-x-3 bg-white shadow-lg rounded-lg px-4 py-2 items-center border border-gray-200">
            <span className="text-sm text-gray-700 font-medium">View:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm outline-none">
              <option>Active {cameras.length()} ()</option>
              <option>Inactive</option>
            </select>

            <span className="text-sm text-gray-700 font-medium">Sort by:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm outline-none">
              <option>Default</option>
              <option>Nearest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
