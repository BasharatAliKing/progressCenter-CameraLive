import React from "react";

const Baseline = ({ data }) => {
  // Default data if none provided
  const defaultData = [
    {
      programId: "Baseline",
      submissionDate: "23-Jan-17",
      approvalDate: "14-Mar-17",
      plannedPercent: "25.96",
      actualPercent: 40.06,
      daysAheadDelay: 42,
      isHighlight: true,
    },
    {
      programId: "Recovery R1",
      submissionDate: "",
      approvalDate: "02-04-17",
      plannedPercent: null,
      actualPercent: null,
      daysAheadDelay: null,
      isHighlight: false,
    },
  ];

  const tableData = data || defaultData;

  const getCellClass = (isHighlight, value) => {
    let baseClass = "px-4 py-3 border border-gray-300 text-center";
    if (isHighlight && value !== null && value !== "") {
      baseClass += " bg-yellow-300";
    }
    return baseClass;
  };

  const formatPercent = (value) => {
    return value !== null ? `${value}` : "";
  };

  const formatDays = (value) => {
    return value !== null ? value : "";
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-400 ">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-4 py-3 border border-gray-400 text-left font-bold text-sm">
              BASELINE / RECOVERY PROGRAMME COMPARISON
            </th>
            <th className=" px-4 py-3 border border-gray-400 text-center font-bold text-sm">
              Submission date
            </th>
            <th className="px-4 py-3 border border-gray-400 text-center font-bold text-sm">
              Approval Date
            </th>
            <th className="px-4 py-3 border border-gray-400 text-center font-bold text-sm">
              Planned %
            </th>
            <th className="px-4 py-3 border border-gray-400 text-center font-bold text-sm">
              Actual %
            </th>
            <th className="px-4 py-3 border border-gray-400 text-center font-bold text-sm">
              (Days) +Ahead / -Delay
            </th>
          </tr>
          <tr>
            <th className=" rounded-2x2 px-4 py-2 border border-gray-400 text-left font-bold text-sm bg-[#e7e4dc]">
              PROGRAM ID
            </th>
            <th className="px-4 py-2 border border-gray-400"></th>
            <th className="px-4 py-2 border border-gray-400"></th>
            <th className="px-4 py-2 border border-gray-400"></th>
            <th className="px-4 py-2 border border-gray-400"></th>
            <th className="px-4 py-2 border border-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td
                className={`px-4 py-3 border border-gray-300 font-semibold ${
                  row.programId === "Baseline" ? "text-red-600" : "text-black"
                }`}
              >
                {row.programId}
              </td>
              <td className={getCellClass(row.isHighlight, row.submissionDate)}>
                {row.submissionDate}
              </td>
              <td className={getCellClass(row.isHighlight, row.approvalDate)}>
                {row.approvalDate}
              </td>
              <td className={getCellClass(row.isHighlight, row.plannedPercent)}>
                {formatPercent(row.plannedPercent)}
              </td>
              <td className={getCellClass(row.isHighlight, row.actualPercent)}>
                {formatPercent(row.actualPercent)}
              </td>
              <td className={getCellClass(row.isHighlight, row.daysAheadDelay)}>
                {formatDays(row.daysAheadDelay)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Baseline;
