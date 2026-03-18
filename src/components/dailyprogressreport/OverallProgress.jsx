const ProgressAnalysisTable = ({
  overallSchedulePerformance = 25.96,
  overallActivityPerformance = 40.06,
  variance = 14.1,
  daysAheadDelay = 42,
  programId = "Baseline",
  thisWeek = {
    planned: 25.96,
    actual: 40.06,
    position: 14.1,
  },
  lastWeek = {
    planned: 24.99,
    actual: 39.28,
    position: 14.29,
  },
  gainLoss = -0.19,
}) => {
  const formatPercentage = (value) => `${value.toFixed(2)}%`;
  const formatGainLoss = (value) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(3)}%`;

  return (
    <div className="w-full max-w-5*1 mx-auto bg-gray-200 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className=" px-6 py-3 border-b border-gray-100">
        <h2 className=" text-center font-bold text-black">
          OVERALL PROGRESS ANALYSIS
        </h2>
      </div>

      {/* Single Unified Table */}
      <table className="w-full border-collapse">
        {/* Top Summary Row */}
        <tbody>
          <tr className="bg-gray-100">
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">
                Overall Schedule Performance % (1)
              </div>
              <div className="text-lg font-bold">
                {formatPercentage(overallSchedulePerformance)}
              </div>
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">
                Overall Activity Performance % (2)
              </div>
              <div className="text-lg font-bold">
                {formatPercentage(overallActivityPerformance)}
              </div>
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">Variance (3) = (1-2)</div>
              <div className="text-lg font-bold">
                {formatPercentage(variance)}
              </div>
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">(Days) +Ahead / -Delay</div>
              <div className="text-lg font-bold">{daysAheadDelay}</div>
            </td>
            <td className="border border-gray-400 bg-gray-100"></td>
            <td className="border border-gray-400 bg-gray-100"></td>
            <td className="border border-gray-400 bg-gray-100"></td>
            <td className="border border-gray-400 bg-gray-100"></td>
          </tr>

          {/* Main Headers Row */}
          <tr className="bg-gray-100">
            <td className="border border-gray-400 p-3 text-center font-semibold">
              Program ID
            </td>
            <td
              className="border border-gray-400 p-3 text-center font-semibold bg-gray-100"
              colSpan="3"
            >
              This Week
            </td>
            <td
              className="border border-gray-400 p-3 text-center font-semibold bg-gray-100"
              colSpan="3"
            >
              Last Week
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold bg-gray-100">
              <div>Gain / Loss</div>
              <div className="text-xs">(7) = (3-6)</div>
            </td>
          </tr>

          {/* Sub Headers Row */}
          <tr className="bg-gray-100">
            <td className="border border-gray-400 bg-gray-100"></td>
            <td className="border border-gray-400 p-2 text-center font-semibold text-sm">
              Planned % (1)
            </td>
            <td className="border border-gray-400 p-2 text-center font-semibold text-sm">
              Actual % (2)
            </td>
            <td className="border border-gray-400 p-2 text-center font-semibold text-sm">
              <div>Position (3) = (2 -1)</div>
            </td>
            <td className="border border-gray-400 p-2 text-center font-semibold text-sm">
              Planned % (4)
            </td>
            <td className="border border-gray-400 p-2 text-center font-semibold text-sm">
              Actual % (5)
            </td>
            <td className="border border-gray-400 p-2 text-center font-semibold text-sm">
              <div>Position</div>
              <div>(6) = (5-4)</div>
            </td>
            <td className="border border-gray-400 bg-gray-100"></td>
          </tr>

          {/* Data Row */}
          <tr className="bg-white">
            <td className="border border-gray-400 p-3 text-center font-semibold text-red-600">
              {programId}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatPercentage(thisWeek.planned)}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatPercentage(thisWeek.actual)}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatPercentage(thisWeek.position)}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatPercentage(lastWeek.planned)}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatPercentage(lastWeek.actual)}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatPercentage(lastWeek.position)}
            </td>
            <td className="border border-gray-400 p-3 text-center">
              {formatGainLoss(gainLoss)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Example usage with default values
function App() {
  // Example data - you can easily change these values
  const exampleData = {
    overallSchedulePerformance: 25.96,
    overallActivityPerformance: 40.06,
    variance: 14.1,
    daysAheadDelay: 42,
    programId: "Baseline",
    thisWeek: {
      planned: 25.96,
      actual: 40.06,
      position: 14.1,
    },
    lastWeek: {
      planned: 24.99,
      actual: 39.28,
      position: 14.29,
    },
    gainLoss: -0.19,
  };

  return (
    <div className="p-8 bg-[#e7e4dc] rounded-2xl ">
      <ProgressAnalysisTable {...exampleData} />
    </div>
  );
}
export default App;
