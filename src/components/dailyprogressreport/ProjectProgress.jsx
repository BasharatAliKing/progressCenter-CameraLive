import React from "react";

const ProjectProgressTable = ({
  overallProgress = { planned: 25.96, actual: 40.06, difference: 14.1 },
  workBreakdownStructure = [
    {
      name: "PROCUREMENT PROCESS",
      planned: 100.0,
      actual: 95.35,
      difference: -4.65,
    },
    { name: "ENGINEERING", planned: 100.0, actual: 93.38, difference: -6.62 },
    {
      name: "MATERIALS/EQUIPMENT DELIVERIES",
      planned: 58.31,
      actual: 58.81,
      difference: 0.5,
    },
    { name: "CONSTRUCTION", planned: 24.34, actual: 39.07, difference: 14.73 },
    {
      name: "ENABLING WORKS & BULK EXCAVATION",
      planned: 100.0,
      actual: 100.0,
      difference: 0.0,
    },
    {
      name: "SUBSTRUCTURE ICL. GROUND FLOOR SLABS",
      planned: 100.0,
      actual: 100.0,
      difference: 0.0,
    },
    { name: "SUPERSTRUCTURE", planned: 59.77, actual: 90.6, difference: 30.83 },
    {
      name: "INTERNAL FINISHES & MEP SERVICES",
      planned: 1.84,
      actual: 18.83,
      difference: 16.99,
    },
    {
      name: "FAÇADE & ROOF FINISHES",
      planned: 3.48,
      actual: 10.92,
      difference: 7.44,
    },
    { name: "MOCK-UP", planned: 66.72, actual: 100.0, difference: 33.28 },
    {
      name: "PLANTROOM INSTALLATIONS & ARTERIAL/SHAFTS SERVICES",
      planned: 3.78,
      actual: 12.39,
      difference: 8.61,
    },
    {
      name: "SPECIALIST EQUIPMENT",
      planned: 0.0,
      actual: 0.0,
      difference: 0.0,
    },
    { name: "EXTERNAL WORKS", planned: 0.0, actual: 0.0, difference: 0.0 },
  ],
}) => {
  const formatPercentage = (value) => `${value.toFixed(2)}%`;

  const getDifferenceColor = (difference) => {
    if (difference > 0) return "text-blue-600";
    if (difference < 0) return "text-red-600";
    return "text-black";
  };

  const getDifferencePrefix = (difference) => {
    if (difference > 0) return "+";
    return "";
  };

  return (
    <div className="w-full bg-amber-50 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className=" text-center text-xl font-bold text-gray-800 mb-2">
          PROJECT PROGRESS SCHEDULE
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                WBS Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                Planned
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                Actual
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                -Delay/+Ahead
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-amber-50 font-semibold">
              <td className="border border-gray-300 px-4 py-3 text-gray-800">
                OVERALL PROGRESS
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                {formatPercentage(overallProgress.planned)}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">
                {formatPercentage(overallProgress.actual)}
              </td>
              <td
                className={`border border-gray-300 px-4 py-3 text-center font-semibold ${getDifferenceColor(
                  overallProgress.difference
                )}`}
              >
                {getDifferencePrefix(overallProgress.difference)}
                {formatPercentage(overallProgress.difference)}
              </td>
            </tr>

            {workBreakdownStructure.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-amber-50" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-3 text-gray-800">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                  {formatPercentage(item.planned)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                  {formatPercentage(item.actual)}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-3 text-center font-medium ${getDifferenceColor(
                    item.difference
                  )}`}
                >
                  {getDifferencePrefix(item.difference)}
                  {formatPercentage(item.difference)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectProgressTable;
