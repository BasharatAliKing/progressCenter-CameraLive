import React from "react";

export default function TimelapseGallery({
  snapshots,
  selectedSnapshot,
  onSelectSnapshot,
  formatTime,
  imagePath
}) {
  return (
    <div className="">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {snapshots.length > 0 ? (
          snapshots.map((snapshot, index) => (
            <div
              key={index}
              onClick={() => onSelectSnapshot(snapshot)}
              className={`flex-shrink-0 cursor-pointer rounded-xl border-2 overflow-hidden transition ${
                selectedSnapshot?.url === snapshot.url
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={`${imagePath}${snapshot.url}`}
                alt={formatTime(snapshot.createdAt)}
                className="w-26 h-18 object-cover"
              />
              <div className="bg-white px-2 py-1 text-center">
                <span className="text-xs font-semibold text-gray-700">
                  {formatTime(snapshot.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No snapshots available for this date</p>
        )}
      </div>
    </div>
  );
}
