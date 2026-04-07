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

const ManpowerHistogram = (data) => {
  const mainData = data?.data?.manPowerHistogram || [];

  // Convert table data → chart data
  const chartData = mainData.map((item) => ({
    period: item.manpower_month,
    plannedManpower: Number(item.manpower_planned),
    actualManpower: Number(item.manpower_actual),
  }));

  return (
    <div className="w-full bg-[#e7e4dc] p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          MANPOWER HISTOGRAM
        </h2>
      </div>

      {/* Table */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  MONTH
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  Planned
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  Actual
                </th>
              </tr>
            </thead>

            <tbody>
              {mainData.map((val, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {val.manpower_month}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {val.manpower_planned}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {val.manpower_actual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 text-center mb-4">
          Manpower Histogram
        </h3>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="period" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="plannedManpower" name="Planned" fill="#3b82f6" />

              <Bar dataKey="actualManpower" name="Actual" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManpowerHistogram;
