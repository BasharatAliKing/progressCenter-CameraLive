import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProgressSCurve = ({ data }) => {
  return (
    <div className="w-full bg-[#e7e4dc] rounded-md p-8 shadow-md mb-6">
      <h2 className=" text-center text-xl font-bold text-gray-800 mb-4">
        Progress S-Curve (Planned vs Actual)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* X Axis */}
          <XAxis
            dataKey="month"
            tick={{ fill: "#000000", fontWeight: 500 }} // red-500 for X-axis text code for black is
          />
          {/* Y Axis */}
          <YAxis
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
            tick={{ fill: "#000000", fontWeight: 500 }} // blue-500 for Y-axis text
          />
          <Tooltip formatter={(value) => `${value}%`} /> //to change colour of
          tooltip text
          <Legend />
          {/* Planned (Schedule) Performance */}
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#3b82f6" // blue-500
            strokeWidth={3}
            name="Overall Schedule Performance"
          />
          {/* Actual (Activity) Performance */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ef4444" // red-500
            strokeWidth={3}
            name="Overall Activity Performance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressSCurve;
