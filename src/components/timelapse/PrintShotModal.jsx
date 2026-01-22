import React from "react";
import { X, Download, Printer } from "lucide-react";

export default function PrintShotModal({
  isOpen,
  imageUrl,
  imagePath,
  currentImageTime,
  selectedDate,
  zoom,
  onClose,
  onDownload,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  formatTime,
  formatDate
}) {
  if (!isOpen) return null;

  const zoomPercent = Math.round(zoom * 100);

  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-gray-900 text-white flex items-center justify-between px-6 py-3 gap-6">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <button
              className="p-2 hover:bg-gray-800 rounded transition"
              title="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            
            <div className="flex items-center gap-2 text-sm border-l border-gray-700 pl-6">
              <span className="font-medium">1 / 1</span>
            </div>

            <div className="flex items-center gap-2 border-l border-gray-700 pl-6">
              <button className="p-2 hover:bg-gray-800 rounded transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-800 rounded transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-800 rounded transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-800 rounded transition"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            
             <button className="p-2 hover:bg-gray-800 rounded transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Header Section */}
        <div className="bg-white px-8 py-6 border-b border-gray-200 text-center">
          <div className="flex items-center justify-center mb-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="24" height="24" rx="2" fill="#8B0000" fillOpacity="0.1"/>
              <path d="M12 8H20V20H12Z" fill="#8B0000"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Neela Gumbad - Camera 1</h2>
        </div>

        {/* Image Container */}
        <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center min-h-0">
          <img
            src={`${imagePath}${imageUrl}`}
            alt="Print Shot"
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Footer Section */}
        <div className="bg-white px-8 py-8 border-t border-gray-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm font-medium">
              Image of {formatTime(currentImageTime) ? `${formatTime(currentImageTime)} · ${formatDate(selectedDate)}` : formatDate(selectedDate)}
            </p>
          </div>
          
          {/* Logo/Watermark */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 10.26H24L17.55 15.91L20.64 24L12 18.35L3.36 24L6.45 15.91L0 10.26H8.91L12 2Z"/>
            </svg>
            <div className="text-center text-xs text-gray-700">
              <p className="font-semibold">progress center</p>
              <p className="text-gray-600">ProgressCenter is a registered trademark of Timelapse ME.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
