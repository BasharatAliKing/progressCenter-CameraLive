import React from "react";

const MainRisksTable = ({
  risks = [
    {
      riskDescription: "Post-Tension Drawings Approval by DM",
      riskCategory: "Closed",
      impact: "Closed",
      riskResponse: "Risk Closed, Issued On 29-Jun-17",
    },
  ],
  emptyRows = 8,
}) => {
  // Unified color function for both riskCategory and impact
  const getColorClass = (value) => {
    switch (value?.toLowerCase()) {
      case "critical":
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
      case "none": // For impacts
        return "bg-green-100 text-green-800 border-green-300";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Badge component for category/impact display
  const getBadge = (text, colorClass) => {
    if (!text) return null;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  // Merge risks with empty rows
  const allRows = [...risks];
  for (let i = 0; i < emptyRows; i++) {
    allRows.push({
      riskDescription: "",
      riskCategory: "",
      impact: "",
      riskResponse: "",
    });
  }

  return (
    <div className="w-full bg-[#e7e4dc] p-6 rounded-lg shadow-lg">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          11.0 MAIN RISKS [ Risks with Cost/ Time impact]
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 w-2/5">
                Risk Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-1/6">
                Risk Category
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-1/6">
                Impact
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 w-1/3">
                Risk Response
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
                  {item.riskDescription}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {getBadge(
                    item.riskCategory,
                    getColorClass(item.riskCategory)
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {getBadge(item.impact, getColorClass(item.impact))}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {item.riskResponse}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {risks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {/* Total Risks */}
          <div className="bg-white px-3 py-2 rounded border">
            <span className="font-medium text-gray-600">Total Risks: </span>
            <span className="font-bold text-gray-800">{risks.length}</span>
          </div>

          {/* Risk Category Summary */}
          {["Critical", "High", "Medium", "Low", "Closed", "Open"].map(
            (category) => {
              const count = risks.filter(
                (risk) =>
                  risk.riskCategory?.toLowerCase() === category.toLowerCase()
              ).length;
              if (count > 0) {
                return (
                  <div
                    key={category}
                    className="bg-white px-3 py-2 rounded border"
                  >
                    <span className="font-medium text-gray-600">
                      {category}:{" "}
                    </span>
                    <span
                      className={`font-bold ${
                        category === "Critical" || category === "High"
                          ? "text-red-600"
                          : category === "Medium"
                          ? "text-yellow-600"
                          : category === "Low"
                          ? "text-green-600"
                          : category === "Closed"
                          ? "text-gray-600"
                          : "text-blue-600"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                );
              }
              return null;
            }
          )}

          {/* Impact Summary */}
          {["Critical", "High", "Medium", "Low"].map((impact) => {
            const count = risks.filter(
              (risk) => risk.impact?.toLowerCase() === impact.toLowerCase()
            ).length;
            if (count > 0) {
              return (
                <div
                  key={`impact-${impact}`}
                  className="bg-white px-3 py-2 rounded border"
                >
                  <span className="font-medium text-gray-600">
                    {impact} Impact:{" "}
                  </span>
                  <span
                    className={`font-bold ${
                      impact === "Critical" || impact === "High"
                        ? "text-red-600"
                        : impact === "Medium"
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

export default MainRisksTable;
