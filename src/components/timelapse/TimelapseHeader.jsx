import React from "react";
import { Camera, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function TimelapseHeader({ 
  cameras, 
  params, 
  onSnapshot, 
  onReload,
  modeLabel = "TimeLapse",
  snapshotLabel = "Download image"
}) {
  return (
    <div className="flex items-center text-black bg-white/10 backdrop-blur-sm border-b border-white/20 justify-between px-6 py-4 shadow-sm">
      {/* Left Section */}
      <div>
        {/* Breadcrumb */}
        <div className="text-sm mb-1 text-[#667085]">
          <Link className="text-[#667085] duration-500 hover:scale-105" to='/dashboard'>Dashboard</Link> /
          <Link to={`/project/${params.id}`} className="text-[#667085]">{" "}{cameras.location}</Link> /
          <span className="font-medium text-[#101828]">{" "}{cameras.name} - {modeLabel}</span>
        </div>
        {/* Title */}
        <h2 className="text-xl text-[#101828] font-bold">
          {cameras.name} - {cameras.location}
        </h2>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Change Camera Button */}
        <button className="flex items-center text-sm font-medium cursor-pointer gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 shadow hover:bg-gray-50 border border-gray-200 transition">
          <Camera size={18} />
          Change Camera
        </button>

        {/* Download Image */}
        <button
          onClick={onSnapshot}
          className="flex items-center text-sm font-medium cursor-pointer duration-500 hover:scale-105 gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 shadow hover:bg-gray-50 border border-gray-200 transition"
        >
          <Download size={18} />
          {snapshotLabel}
        </button>

        {/* Reload */}
        <button
          title="Refresh"
          onClick={onReload}
          className="flex cursor-pointer duration-500 hover:scale-105 items-center justify-center w-10 h-10 rounded-xl bg-white text-gray-700 shadow hover:bg-gray-50 border border-gray-200 transition"
        >
          <RefreshCw className="hover:animate-spin" size={18} />
        </button>
      </div>
    </div>
  );
}
