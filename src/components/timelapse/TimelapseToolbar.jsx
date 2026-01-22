import React from "react";
import { X } from "lucide-react";

export default function TimelapseToolbar({
  isTimeMenuOpen,
  selectedDate,
  currentImageTime,
  formatTime,
  formatDate,
  onToggleMenu
}) {
  return (
    <div className="flex z-10 items-center text-sm font-medium absolute w-[90%] justify-between px-6 py-3">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow hover:bg-gray-50 border border-gray-200 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
          Tools and Add-ons
        </button>
        <button 
          onClick={onToggleMenu}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {currentImageTime && <span id="time">{formatTime(currentImageTime)}</span>}
          {currentImageTime && <span> · </span>}
          <span id="date">{formatDate(selectedDate)}</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 mr-5">
        <div className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[#121212b9] text-white font-medium">
          <span className="text-sm">11 C</span> · <span>Smoke</span> · <span>smoke</span>
        </div>
      </div>
    </div>
  );
}
