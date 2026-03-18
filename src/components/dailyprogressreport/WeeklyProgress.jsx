import React from "react";

const WeeklyProgressTasks = ({
  lastWeekData = {
    completedActivities: ["Conc. Casting for Roof Slab Part3"],
    inProgressActivities: [
      "Conc. Casting for Roof Slab Part3",
      "RCC for Columns/Walls RF-URF",
      "Block Works - GF, 1F, 2F & 3F",
      "Plaster Works - BF, GF, 1F & 2F",
      "MEP 1st/2nd Fix - BF,GF,1F,2F&3F",
      "Tiling Works - 1F",
      "Painting - 1F",
    ],
  },
  thisWeekData = {
    completedActivities: ["RCC for Columns/Walls RF-URF"],
    inProgressActivities: [
      "Shutter works for Upper Roof Slab",
      "Block Works - 3F & 4F",
      "Plaster Works - BF, GF, 1F & 2F",
      "MEP 1st/2nd Fix - BF,GF,1F,2F&3F",
      "Tiling Works - 1F",
      "Painting - 1F",
      "False Ceiling - 1F",
    ],
  },
  nextWeekData = {
    completedActivities: ["Shutter works for Upper Roof Slab"],
    inProgressActivities: [
      "Shutter works for Upper Roof Slab",
      "Block Works - 3F & 4F",
      "Plaster Works - BF, GF, 1F & 2F",
      "MEP 1st/2nd Fix - BF,GF,1F,2F&3F",
      "Tiling  - 1F",
      ,
      "False Ceiling - 1F",
    ],
  },
  // Number of empty rows to display for additional entries in each section
  emptyRowsPerSection = 5,
}) => {
  const WeekColumn = ({ title, data, bgColor }) => {
    // Ensure we have arrays and pad with empty strings for empty rows
    const completedActivities = [...(data.completedActivities || [])];
    const inProgressActivities = [...(data.inProgressActivities || [])];

    // Add empty rows to completed activities
    while (completedActivities.length < emptyRowsPerSection) {
      completedActivities.push("");
    }

    // Add empty rows to in-progress activities
    while (inProgressActivities.length < emptyRowsPerSection) {
      inProgressActivities.push("");
    }

    return (
      <div className="flex-1">
        {/* Week Title */}
        <div
          className={`${bgColor} border border-gray-300 px-4 py-3 text-center font-bold text-gray-800`}
        >
          {title}
        </div>

        {/* Completed Activities Section */}
        <div className="bg-primary border-l border-r border-gray-300 px-4 py-2 text-center font-bold text-white">
          Completed Activities
        </div>

        {completedActivities.map((activity, index) => (
          <div
            key={`completed-${index}`}
            className={`border-l border-r border-b border-gray-300 px-4 py-2 min-h-[40px] text-sm text-gray-700 ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            }`}
          >
            {activity}
          </div>
        ))}

        {/* In Progress Activities Section */}
        <div className="bg-primary border-l border-r border-gray-300 px-4 py-2 text-center font-bold text-white">
          In Progress Activities
        </div>

        {inProgressActivities.map((activity, index) => (
          <div
            key={`progress-${index}`}
            className={`border-l border-r border-b border-gray-300 px-4 py-2 min-h-[40px] text-sm text-gray-700 ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            }`}
          >
            {activity}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#e7e4dc] p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          WEEKLY PROGRESS MAIN TASKS
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex">
          <WeekColumn
            title='"LAST" Week Progress'
            data={lastWeekData}
            bgColor="bg-gray-100"
          />

          <WeekColumn
            title='"THIS" Week Progress as of'
            data={thisWeekData}
            bgColor="bg-blue-100"
          />

          <WeekColumn
            title='"NEXT" Week Progress'
            data={nextWeekData}
            bgColor="bg-green-100"
          />
        </div>
      </div>

      {/* Optional: Add summary statistics */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="bg-white px-3 py-2 rounded border">
          <span className="font-medium text-gray-600">
            Last Week Completed:{" "}
          </span>
          <span className="font-bold text-green-600">
            {lastWeekData.completedActivities?.filter(
              (activity) => activity.trim() !== ""
            ).length || 0}
          </span>
        </div>

        <div className="bg-white px-3 py-2 rounded border">
          <span className="font-medium text-gray-600">
            This Week Completed:{" "}
          </span>
          <span className="font-bold text-green-600">
            {thisWeekData.completedActivities?.filter(
              (activity) => activity.trim() !== ""
            ).length || 0}
          </span>
        </div>

        <div className="bg-white px-3 py-2 rounded border">
          <span className="font-medium text-gray-600">
            This Week In Progress:{" "}
          </span>
          <span className="font-bold text-blue-600">
            {thisWeekData.inProgressActivities?.filter(
              (activity) => activity.trim() !== ""
            ).length || 0}
          </span>
        </div>

        <div className="bg-white px-3 py-2 rounded border">
          <span className="font-medium text-gray-600">Next Week Planned: </span>
          <span className="font-bold text-orange-600">
            {nextWeekData.inProgressActivities?.filter(
              (activity) => activity.trim() !== ""
            ).length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressTasks;
