import React from "react";

const TopIssuesTable = ({
  issues = [
    {
      issue: "Nomination & Selection of Reception Counter",
      originator: "Contractor",
      category: "Medium",
      recommendedAction: "",
      actionBy: "Client",
    },
  ],
  // Number of empty rows to display for additional entries
  emptyRows = 10,
}) => {
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "high":
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getCategoryBadge = (category) => {
    if (!category) return null;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
          category
        )}`}
      >
        {category}
      </span>
    );
  };

  // Create array of all rows (filled + empty)
  const allRows = [...issues];
  for (let i = 0; i < emptyRows; i++) {
    allRows.push({
      issue: "",
      originator: "",
      category: "",
      recommendedAction: "",
      actionBy: "",
    });
  }

  return (
    <div className="w-full bg-[#e7e4dc] p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          9.0 TOP ISSUES [Technical/ Commercial related activities & requires
          actions]
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 w-2/5">
                Issue
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-1/8">
                Originator
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-1/8">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 w-2/5">
                Recommended Action
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-1/8">
                Action by
              </th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-3 text-gray-800 min-h-[40px]">
                  {item.issue}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                  {item.originator}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {getCategoryBadge(item.category)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {item.recommendedAction}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                  {item.actionBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Add summary statistics */}
      {issues.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="bg-white px-3 py-2 rounded border">
            <span className="font-medium text-gray-600">Total Issues: </span>
            <span className="font-bold text-gray-800">{issues.length}</span>
          </div>
          {["High", "Medium", "Low"].map((priority) => {
            const count = issues.filter(
              (issue) =>
                issue.category?.toLowerCase() === priority.toLowerCase()
            ).length;
            if (count > 0) {
              return (
                <div
                  key={priority}
                  className="bg-white px-3 py-2 rounded border"
                >
                  <span className="font-medium text-gray-600">
                    {priority} Priority:{" "}
                  </span>
                  <span
                    className={`font-bold ${
                      priority === "High"
                        ? "text-red-600"
                        : priority === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default TopIssuesTable;
