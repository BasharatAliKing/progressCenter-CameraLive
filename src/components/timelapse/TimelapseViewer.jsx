import React from "react";
import { Minus, Plus } from "lucide-react";

export default function TimelapseViewer({
  imageUrl,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  imagePath
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 px-4">
      <div className="relative overflow-hidden shadow-2xl w-full max-w-4xl">
        <img
          src={`${imagePath}${imageUrl}`}
          style={{ transform: `scale(${zoom})` }}
          className="w-full h-[80vh] bg-black object-cover transition-transform duration-200"
        />
      </div>

      {/* Zoom controls below video */}
      <div className="flex absolute z-10 -bottom-5 items-center gap-8 rounded-full px-8 py-4 mb-4">
        <button
          onClick={onZoomOut}
          className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-md bg-white/80 hover:bg-white/40 transition-all duration-200"
        >
          <Minus className="w-5 h-5 text-black" />
        </button>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-48 h-2 bg-white/80 rounded-full appearance-none cursor-pointer accent-white"
            style={{
              background: `${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) ${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <span className="text-white font-medium min-w-fit select-none">
            {zoom.toFixed(1)}x
          </span>
        </div>

        <button
          onClick={onZoomIn}
          className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-md bg-white/80 hover:bg-white/40 transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
}
