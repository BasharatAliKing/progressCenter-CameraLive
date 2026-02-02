import React from "react";
import { X } from "lucide-react";
import TimelapseCalendar from "./TimelapseCalendar";
import TimelapseGallery from "./TimelapseGallery";

export default function TimelapseBottomSheet({
  isOpen,
  showCalendar,
  selectedDate,
  currentImageTime,
  selectedSnapshot,
  snapshots,
  currentMonth,
  availableDates,
  formatDate,
  formatTime,
  imagePath,
  onClose,
  onToggleCalendar,
  onDateSelect,
  onMonthChange,
  onSelectSnapshot,
  onApply
}) {
  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-10"
        onClick={onClose}
      />
      
      {/* Calendar Modal Popup */}
      {showCalendar && (
        <div className="fixed top-32 left-32 bg-white rounded-xl shadow-2xl p-6 z-40 w-80">
          <TimelapseCalendar
            currentMonth={currentMonth}
            availableDates={availableDates}
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              onDateSelect(date);
            }}
            onMonthChange={onMonthChange}
          />
        </div>
      )}
      
      {/* Bottom Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f7f7f799] backdrop-blur-sm ml-[80px] shadow-2xl border-t border-gray-200 p-6 py-3 z-20 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div  onClick={onToggleCalendar}
              className="flex items-center gap-2 cursor-pointer text-sm bg-[#fff] p-2 rounded-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {currentImageTime && <span className="font-medium text-gray-800">{formatTime(currentImageTime)}</span>}
            {currentImageTime && <span className="text-gray-600">·</span>}
            <span className="font-medium text-gray-800">{formatDate(selectedDate)}</span>
            <button 
              className="ml-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition"
              title="Select Date"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <button 
            onClick={onClose}
            title="Close"
            className="text-black bg-white rounded-full p-2 cursor-pointer hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
        {/* Snapshots Gallery */}
        <TimelapseGallery
          snapshots={snapshots}
          selectedSnapshot={selectedSnapshot}
          onSelectSnapshot={(snapshot) => {
            onApply(snapshot);
          }}
          formatTime={formatTime}
          imagePath={imagePath}
        />
      </div>
    </>
  );
}
