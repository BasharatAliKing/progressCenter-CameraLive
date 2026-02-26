import React, { useEffect, useRef } from "react";
import { File, SlidersVertical, Usb, Video, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;
export default function TimelapseToolbar({
  isTimeMenuOpen,
  selectedDate,
  currentImageTime,
  formatTime,
  formatDate,
  onToggleMenu,
  showToolsMenu,
  onToggleToolsMenu
}) {
  const menuRef = useRef(null);
  const {id} =useParams();
  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (showToolsMenu && onToggleToolsMenu) {
          onToggleToolsMenu();
        }
      }
    };
    
    if (showToolsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolsMenu]);

  return (
    <div className="flex z-10 items-center text-sm font-medium absolute w-[90%] justify-between px-6 py-3">
      {/* Left Section */}
      <div className="flex  gap-4 relative">
        <div className="relative">
        {
          showToolsMenu ?  null :
           <button 
            onClick={onToggleToolsMenu}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow hover:bg-gray-50 border border-gray-200 transition cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
            Tools and Add-ons
          </button>
        }

          {/* Tools and Add-ons Menu */}
          {showToolsMenu && (
            <div ref={menuRef} className=" top-0 left-0 bg-white rounded-2xl shadow-xl w-[300px] p-5 z-50">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-gray-900">Tools and Add-ons</h3>
                <button 
                  onClick={onToggleToolsMenu}
                  className="text-gray-400 hover:text-gray-600  cursor-pointer transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                {/* LiveLapse */}
                <Link to={`/camera/${id}/timelapse`} className="w-full flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full p-[6px] bg-primary flex items-center justify-center flex-shrink-0">
                   <Video className="text-white " />
                  </div>
                  <span className="text-gray-900 font-normal text-sm">LiveLapse</span>
                </Link>
                {/* side by side video */}
                <Link to={`/camera/${id}/side-by-side-video`} className="w-full flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full p-[6px] bg-primary flex items-center justify-center flex-shrink-0">
                   <Video className="text-white " />
                  </div>
                  <span className="text-gray-900 font-normal text-sm">Side by Side Video</span>
                </Link>


                {/* Progress Slider */}
                <button className="w-full flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full p-[6px] bg-primary flex items-center justify-center flex-shrink-0">
                    <SlidersVertical className="text-white" />
                  </div>
                  <span className="text-gray-900 font-normal text-sm">Progress Slider</span>
                </button>

                {/* Integrations */}
                <button className="w-full flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full p-[6px] bg-primary flex items-center justify-center flex-shrink-0">
                    <Usb className="text-white" />
                  </div>
                  <span className="text-gray-900 font-normal text-sm">Integrations</span>
                </button>

                {/* Reports */}
                <button className="w-full flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full p-[6px] bg-primary flex items-center justify-center flex-shrink-0">
                    <File className="text-white" />
                  </div>
                  <span className="text-gray-900 font-normal text-sm">Reports</span>
                </button>
              </div>


              </div>
          )}
        </div>
        <button 
          onClick={onToggleMenu}
          className="flex items-center gap-2 px-4 py-2 mb-auto rounded-xl bg-white text-gray-800 font-medium shadow border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
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
      <div className="flex items-center gap-3 mr-5 mb-auto">
        <div className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[#121212b9] text-white font-medium">
          <span className="text-sm">11 C</span> · <span>Smoke</span> · <span>smoke</span>
        </div>
      </div>
    </div>
  );
}
