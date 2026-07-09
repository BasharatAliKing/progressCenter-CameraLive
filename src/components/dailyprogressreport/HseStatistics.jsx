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

const HseStatistics = (data) => {
  const mainData = data?.data?.hseStatistics || [];



  return (
    <div className="w-full bg-[#e7e4dc] p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          HSE STATISTICS TABULATION
        </h2>
      </div>

      {/* Table */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
              
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  Description
                </th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  Weekly Status 
                </th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-bold">
                  Cumulative Status 
                </th>
              </tr>
            </thead>

            <tbody>
              {mainData.map((val, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    {val.hse_category}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-start">
                    {val.hse_description}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {val.hse_weekly_status}
                  </td>
                  <td className="border border-gray-300 max-w-[200px] px-4 py-2 text-center">
                    {val.hse_cumulative_status || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   
    </div>
  );
};

export default HseStatistics;
