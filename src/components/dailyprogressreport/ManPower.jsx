import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ManpowerHistogram = ({
  // Current period data for the table
  currentPeriodData = [
    {
      month: 9,
      weekNo: 39,
      overallPlanned: 225,
      overallActual: 339,
      civilPlanned: 165,
      civilActual: 286,
      mepPlanned: 60,
      mepActual: 53,
    },
    {
      month: 10,
      weekNo: 40,
      overallPlanned: 225,
      overallActual: 316,
      civilPlanned: 165,
      civilActual: 268,
      mepPlanned: 60,
      mepActual: 48,
    },
    {
      month: 10,
      weekNo: 41,
      overallPlanned: 225,
      overallActual: 316,
      civilPlanned: 165,
      civilActual: 268,
      mepPlanned: 60,
      mepActual: 48,
    },
    {
      month: 10,
      weekNo: 42,
      overallPlanned: 225,
      overallActual: 330,
      civilPlanned: 165,
      civilActual: 275,
      mepPlanned: 60,
      mepActual: 55,
    },
  ],

  // Historical data for the chart
  historicalData = [
    { period: "A-23", plannedManpower: 87, actualManpower: 146 },
    { period: "M-23", plannedManpower: 142, actualManpower: 128 },
    { period: "J-23", plannedManpower: 90, actualManpower: 156 },
    { period: "J-23", plannedManpower: 155, actualManpower: 155 },
    { period: "A-23", plannedManpower: 177, actualManpower: 177 },
    { period: "S-23", plannedManpower: 191, actualManpower: 251 },
    { period: "O-23", plannedManpower: 158, actualManpower: 243 },
    { period: "N-23", plannedManpower: 101, actualManpower: 254 },
    { period: "D-23", plannedManpower: 143, actualManpower: 321 },
    { period: "J-24", plannedManpower: 225, actualManpower: 339 },
    { period: "F-24", plannedManpower: 225, actualManpower: 330 },
    { period: "M-24", plannedManpower: 374, actualManpower: 374 },
    { period: "A-24", plannedManpower: 577, actualManpower: 637 },
    { period: "M-24", plannedManpower: 782, actualManpower: 863 },
    { period: "J-24", plannedManpower: 857, actualManpower: 857 },
    { period: "J-24", plannedManpower: 645, actualManpower: 645 },
    { period: "A-24", plannedManpower: 297, actualManpower: 297 },
    { period: "S-24", plannedManpower: 99, actualManpower: 48 },
    { period: "O-24", plannedManpower: 48, actualManpower: 48 },
  ],
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium text-gray-800">{`Period: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${
                entry.dataKey === "plannedManpower" ? "Planned" : "Actual"
              }: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-amber-50 p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          MANPOWER HISTOGRAM
        </h2>
      </div>

      {/* Current Period Data Table */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-50">
                <th className="border border-gray-300 px-4 py-2 text-center font-bold text-gray-700">
                  MONTH
                </th>
                {currentPeriodData.map((period, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center font-bold text-gray-700"
                  >
                    {period.month}
                  </th>
                ))}
              </tr>
              <tr className="bg-amber-50">
                <th className="border border-gray-300 px-4 py-2 text-center font-bold text-gray-700">
                  WEEK NO.
                </th>
                {currentPeriodData.map((period, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700"
                  >
                    {period.weekNo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                  Overal Manpower (Planned)
                </td>
                {currentPeriodData.map((period, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-700"
                  >
                    {period.overallPlanned}
                  </td>
                ))}
              </tr>
              <tr className="bg-amber-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                  Overal Manpower (Actual)
                </td>
                {currentPeriodData.map((period, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-700 font-medium"
                  >
                    {period.overallActual}
                  </td>
                ))}
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                  Civil Manpower (Planned)
                </td>
                {currentPeriodData.map((period, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-700"
                  >
                    {period.civilPlanned}
                  </td>
                ))}
              </tr>
              <tr className="bg-amber-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                  Civil Manpower (Actual)
                </td>
                {currentPeriodData.map((period, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-700 font-medium"
                  >
                    {period.civilActual}
                  </td>
                ))}
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                  MEP Manpower (Planned)
                </td>
                {currentPeriodData.map((period, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-700"
                  >
                    {period.mepPlanned}
                  </td>
                ))}
              </tr>
              <tr className="bg-amber-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                  MEP Manpower (Actual)
                </td>
                {currentPeriodData.map((period, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-700 font-medium"
                  >
                    {period.mepActual}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manpower Histogram Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
          Manpower Histogram
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={historicalData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                angle={-0}
                textAnchor="end"
                height={80}
                fontSize={14}
                stroke="#374151"
              />
              <YAxis
                stroke="#374151"
                fontSize={14}
                domain={[0, 1000]}
                ticks={[0, 200, 400, 600, 800, 1000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
              <Bar
                dataKey="plannedManpower"
                name="Planned Manpower"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="actualManpower"
                name="Actual Manpower"
                fill="#dc2626"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManpowerHistogram;
