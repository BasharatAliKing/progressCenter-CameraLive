const ProgressAnalysisTable = (data) => {
  const mainData = data.data;
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
                {mainData?.overall_schedule_performance_percentage || "0%"}
              </div>
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">
                Overall Activity Performance % (2)
              </div>
              <div className="text-lg font-bold">
                {mainData?.overall_actual_performance_percentage || "0%"}
              </div>
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">Variance (3) = (1-2)</div>
              <div className="text-lg font-bold">{}</div>
            </td>
            <td className="border border-gray-400 p-3 text-center font-semibold">
              <div className="text-sm mb-1">(Days) +Ahead / -Delay</div>
              <div className="text-lg font-bold">
                {mainData?.overall_progress_daysAheadDelay || "0"}
              </div>
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
          {mainData?.overallProgress.map((val, index) => (
            <tr key={index} className="bg-white">
              <td className="border border-gray-400 p-3 text-start font-semibold text-red-600">
                {val.progress_name}
              </td>
              <td className="border border-gray-400 p-3 text-center">
                {val.progress_planned_thisWeek}
              </td>
              <td className="border border-gray-400 p-3 text-center">
                {val.progress_actual_thisWeek}
              </td>
              <td className="border border-gray-400 p-3 text-center">
                {(
                  parseFloat(val.progress_planned_thisWeek || 0) -
                  parseFloat(val.progress_actual_thisWeek || 0)
                ).toFixed(2)}
                %
              </td>
              <td className="border border-gray-400 p-3 text-center">
                {val.progress_planned_lastWeek}
              </td>
              <td className="border border-gray-400 p-3 text-center">
                {val.progress_actual_lastWeek}
              </td>
              <td className="border border-gray-400 p-3 text-center">
                {(
                  parseFloat(val.progress_planned_lastWeek || 0) -
                  parseFloat(val.progress_actual_lastWeek || 0)
                ).toFixed(2)}
                %
              </td>
              <td className="border border-gray-400 p-3 text-center">
                { ((
                  parseFloat(val.progress_planned_thisWeek || 0) -
                  parseFloat(val.progress_actual_thisWeek || 0)
                ).toFixed(2))
                - 
                ((
                  parseFloat(val.progress_planned_lastWeek || 0) -
                  parseFloat(val.progress_actual_lastWeek || 0)
                ).toFixed(2))}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Example usage with default values
function App(data) {
  return (
    <div className="p-8 bg-[#e7e4dc] rounded-2xl ">
      <ProgressAnalysisTable {...data} />
    </div>
  );
}
export default App;
