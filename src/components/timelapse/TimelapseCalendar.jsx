import React from "react";

export default function TimelapseCalendar({
  currentMonth,
  availableDates,
  selectedDate,
  onDateSelect,
  onMonthChange
}) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    return days;
  };

  const isDateAvailable = (date) => {
    return availableDates.some(availDate => 
      availDate.getDate() === date.getDate() &&
      availDate.getMonth() === date.getMonth() &&
      availDate.getFullYear() === date.getFullYear()
    );
  };
  return (
    <div className="absolute -mt-20 left-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 z-50">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onMonthChange(-1)} className="p-1 hover:bg-gray-100 rounded">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span className="font-semibold text-lg">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button onClick={() => onMonthChange(1)} className="p-1 hover:bg-gray-100 rounded">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 py-2">{day}</div>
        ))}
        {generateCalendarDays().map((day, idx) => {
          const isAvailable = isDateAvailable(day.date);
          const isSelected = day.date.toDateString() === selectedDate.toDateString();
          const isToday = day.date.toDateString() === new Date().toDateString();
          return (
            <button
              key={idx}
              onClick={() => onDateSelect(day.date)}
              disabled={!isAvailable}
              className={`py-2 rounded-lg text-sm ${
                !day.isCurrentMonth ? 'text-gray-300' :
                isSelected ? 'bg-blue-600 text-white font-bold' :
                isToday ? 'bg-blue-100 text-blue-600 font-medium' :
                isAvailable ? 'text-gray-900 hover:bg-gray-100 cursor-pointer font-medium' :
                'text-gray-300 cursor-not-allowed'
              }`}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
