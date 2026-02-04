import React, { useState } from "react";

const GridCard = ({
  title,
  images = [],
  layout,
  showDateTime,
  showProjectName,
  showCameraName,
  status = "Published",
  createdOn,
  createdBy,
  createdByAvatar,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "A"
    );
  };

  const getImageSlots = (layoutValue) => {
    const layoutNum = Number(layoutValue);
    if (layoutNum === 1) return 2;
    if (layoutNum === 2) return 4;
    if (layoutNum === 3) return 9;
    if (layoutNum === 4) return 16;
    return 4;
  };

  const slotCount = getImageSlots(layout);
  const displayedImages = images.slice(0, slotCount);

  const getGridColsClass = (layoutValue) => {
    const layoutNum = Number(layoutValue);
    if (layoutNum === 1) return "grid-cols-1";
    if (layoutNum === 2) return "grid-cols-2";
    if (layoutNum === 3) return "grid-cols-3";
    if (layoutNum === 4) return "grid-cols-4";
    return "grid-cols-2";
  };

  const getGridRowsClass = (layoutValue) => {
    const layoutNum = Number(layoutValue);
    if (layoutNum === 1) return "grid-rows-2";
    if (layoutNum === 2) return "grid-rows-2";
    if (layoutNum === 3) return "grid-rows-3";
    if (layoutNum === 4) return "grid-rows-4";
    return "grid-rows-2";
  };

  return (
    <div
      onClick={onClick}
      className="bg-[#e0ded3] rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 border border-black/5 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Header with title and menu */}
      <div className="pb-4 flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-2 hover:bg-white/50 rounded-lg transition"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 8c1.1 0 2-0.9 2-2s-0.9-2-2-2-2 0.9-2 2 0.9 2 2 2zm0 2c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zm0 6c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z" />
            </svg>
          </button>
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onEdit && onEdit();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onDelete && onDelete();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div className="">
        <div
          className={`grid ${getGridColsClass(layout)} ${getGridRowsClass(layout)} h-[200px]`}
        >
          {displayedImages.map((image, idx) => (
            <div
              key={idx}
              className="w-full h-full bg-white/50 overflow-hidden border border-gray-200"
            >
              {image ? (
                <img
                  src={image}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg
                    className="w-6 h-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
          {/* Fill remaining slots with empty placeholders */}
          {[...Array(Math.max(0, slotCount - displayedImages.length))].map(
            (_, idx) => (
              <div
                key={`empty-${idx}`}
                className="w-full h-full rounded-lg bg-white/50 border border-gray-200"
              />
            ),
          )}
        </div>
      </div>

      {/* Status Badge and Info */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Published"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-600 mb-2 gap-1 flex flex-col">
          <p className=" text-xs text-[#70798c]">Created on</p>
          <p className="font-medium text-[#000]">{createdOn}</p>
        </div>

        {/* Created By */}
        {createdBy && (
          <div className="flex flex-col gap-1">
            <p className=" text-xs text-[#70798c]">Created by</p>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {createdByAvatar || getInitials(createdBy)}
              </div>
              <span className="text-xs text-[#000]">{createdBy}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridCard;
