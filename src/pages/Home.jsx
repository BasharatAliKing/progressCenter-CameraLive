import React, { useEffect, useState } from "react";
import { FiSearch, FiBell, FiHelpCircle, FiEdit2 } from "react-icons/fi";
import { IoEarthOutline } from "react-icons/io5";
import { BsGrid } from "react-icons/bs";
import { MdOutlineSafetyCheck } from "react-icons/md";
import { BiLocationPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import BarComponent from "../components/BarComponent";
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
const IMAGE_PATH=import.meta.env.VITE_IMAGE_PATH;// Correct Image Path
const projects = [
  {
    id: 1,
    title: "Neela Gumbad",
    city: "Lahore",
    image: "/card-1.jpg", // replace with your image
    members: ["A", "J", "H", "S"],
    lastUpdate: "6:00 pm · 07 Oct, 2025",
    safetyScore: "—",
    construction: "12 days",
  },
  // {
  //   id: 2,
  //   title: "LDA City Underpass",
  //   city: "Lahore",
  //   image: "/card-2.png", // replace with your image
  //   members: ["A", "J"],
  //   lastUpdate: "6:00 pm · 07 Oct, 2025",
  //   safetyScore: "—",
  //   construction: "11 days",
  // },
  // {
  //   id: 3,
  //   title: "NSIT Phase-1",
  //   city: "Lahore",
  //   image: "/card-2.png", // replace with your image
  //   members: ["A", "J"],
  //   lastUpdate: "6:00 pm · 07 Oct, 2025",
  //   safetyScore: "—",
  //   construction: "11 days",
  // },
];

export default function Home() {
  const [cameras, setCameras] = useState([]);
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch(`${API_URL}/camera`);
        const data = await res.json();
        // ✅ Filter unique locations
      const uniqueCameras = data.cameras.filter(
        (camera, index, self) =>
          index === self.findIndex((c) => c.location === camera.location)
      );
      setCameras(uniqueCameras);
        // console.log(data.cameras);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('Sunrise.jpg')",
      }}
    >
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <BarComponent />
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cameras.map((project, index) => (
            <Link to={`/camera/${project._id}`}
              key={index}
              className="bg-[#f7f5ee]/90 cursor-pointer backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              {/* Status + Edit */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Activity not enabled
                </span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <FiEdit2 className="text-gray-600" />
                </button>
              </div>
              {/* Title */}
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">
                  {project.location}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <BiLocationPlus />
                  {project.city}
                </p>
              </div>
              {/* Image */}
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={`${IMAGE_PATH}${project.image}`}
                  alt={project.location}
                  className="w-full h-40 object-cover"
                />
              </div>
              {/* Members */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Members ·{" "}
                  <span className="text-[#861517] font-medium cursor-pointer">
                    Invite +
                  </span>
                </p>
                {/* <div className="flex -space-x-2">
                  {cameras.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white"
                      style={{
                        backgroundColor:
                          ["#f59e0b", "#6366f1", "#10b981", "#9333ea"][idx % 4],
                        color: "white",
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div> */}
              </div>
              {/* Bottom Info */}
              <div className="flex justify-between mt-4 text-xs text-gray-600">
                <div>
                  <p className="text-gray-400 text-xs">Last update</p>
                  <p className="font-medium">
                    {new Date(project.updatedAt).toISOString().split("T")[0]}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Safety score</p>
                  <MdOutlineSafetyCheck className="text-lg text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Construction</p>
                  <p className="font-medium">
                    {(() => {
                      const createdDate = new Date(project.createdAt);
                      const currentDate = new Date();
                      const diffTime = Math.abs(currentDate - createdDate);
                      const diffDays = Math.floor(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      return `${diffDays} Days `;
                    })()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
