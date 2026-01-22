import React from "react";
import { X, Minus, Plus } from "lucide-react";

export default function TimelapseFullscreen({
  isOpen,
  imageUrl,
  zoom,
  onClose,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  imagePath
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center w-screen h-screen">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-51 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
        title="Back (or press ESC)"
      >
        <X className="w-6 h-6 text-white cursor-pointer" />
      </button>

      {/* Fullscreen Video */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={`${imagePath}${imageUrl}`}
          style={{ transform: `scale(${zoom})` }}
          className="w-full h-full bg-black object-contain transition-transform duration-200"
        />

        {/* Zoom controls in fullscreen */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-white/20 backdrop-blur-sm rounded-full px-8 py-4">
          <button
            onClick={onZoomOut}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200"
          >
            <Minus className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="w-48 h-2 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) ${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <span className="text-white font-medium min-w-fit select-none">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <button
            onClick={onZoomIn}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
