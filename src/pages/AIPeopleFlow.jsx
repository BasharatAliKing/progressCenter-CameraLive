import React, { useState, useRef, useEffect } from "react";
import AIPeopleFlowComp from "../components/AIPeopleFlowComp";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import AISafetyAnalize from "../components/AISafetyAnalize";
import AIEquipmentTracking from "../components/AIEquipmentTracking";

const AiPeopleFlow = () => {
  const [showmenu, setShowMenu] = useState(0);
  return (
    <div className="min-h-screen bg-[url('/Sunrise.jpg')] bg-no-repeat bg-center bg-cover flex flex-col items-center">
      <div className="bg-[#ffffff4d] w-full p-5">
        <div className="flex flex-col gap-1 w-full">
          {/* 🔹 Header */}
        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-primary mb-2 hover:underline flex items-center "
        >
          <ChevronLeft className="mt-[2px]" size="18" /> Back
        </Link>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            Artificial Intelligence{" "}
            <span className="text-gray-400 text-sm">●</span>
          </h1>
          <button className="bg-primary text-white px-4 font-medium cursor-pointer duration-500 hover:scale-105 py-2 rounded-lg shadow">
            Download
          </button>
        </div>
        {/* 🔹 Tabs */}
        <div className="flex gap-6 border-b border-gray-200  text-sm font-medium">
          <button
            onClick={() => {
              setShowMenu(0);
            }}
            className={`cursor-pointer ${
              showmenu == 0
                ? "text-primary border-b-2 border-primary pb-2"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            AI People Flow
          </button>
          <button
            onClick={() => {
              setShowMenu(1);
            }}
            className={`cursor-pointer ${
              showmenu === 1
                ? "text-primary border-b-2 border-primary pb-2"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            AI Safety Analysis
          </button>
          <button
            onClick={() => {
              setShowMenu(2);
            }}
            className={`cursor-pointer ${
              showmenu === 2
                ? "text-primary border-b-2 border-primary pb-2"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            AI Equipment Tracking <sup>beta</sup>
          </button>
        </div>
        </div>
      </div>
      <div className="w-[90%] max-w-7xl mt-5 relative">
        {showmenu === 0 ? (
          <AIPeopleFlowComp />
        ) : showmenu === 1 ? (
          <AISafetyAnalize />
        ) : (
          <AIEquipmentTracking />
        )}
      </div>
    </div>
  );
};

export default AiPeopleFlow;
