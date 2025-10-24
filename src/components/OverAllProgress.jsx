import { Cctv, Tv } from "lucide-react";
import React from "react";
import { GiProgression } from "react-icons/gi";
import {
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const actual = 55;
const planned = 75;
const actualValue = Math.min(actual, planned);
const datachart = [
  { name: "Actual", value: actualValue },
  { name: "Remaining", value: planned - actualValue },
];

  const data = [
    { month: "Aug-24", planned: 5, actual: 2 },
    { month: "Sep-24", planned: 15, actual: 10 },
    { month: "Oct-24", planned: 25, actual: 20 },
    { month: "Nov-24", planned: 32, actual: 28 },
    { month: "Dec-24", planned: 38, actual: 35 },
    { month: "Jan-25", planned: 45, actual: 40 },
    { month: "Feb-25", planned: 50, actual: 45 },
    { month: "Mar-25", planned: 58, actual: 48 },
    { month: "Apr-25", planned: 63, actual: 52 },
    { month: "May-25", planned: 70, actual: 55 },
    { month: "Jun-25", planned: 76, actual: 58 },
    { month: "Jul-25", planned: 82, actual: 61 },
    { month: "Aug-25", planned: 87, actual: 64 },
    { month: "Sep-25", planned: 92, actual: 67 },
    { month: "Oct-25", planned: 95, actual: 70 },
    { month: "Nov-25", planned: 98, actual: 72 },
    { month: "Dec-25", planned: 100, actual: 75 },
  ];

  const plannedProgress = data[data.length - 1].planned;
  const actualProgress = data[data.length - 1].actual;
  const dataDate = "10-Sep-25";
const COLORS = ["#6366F1", "#22C55E", "#EF4444"];

export default function OverAllProgress() {
  return (
    <div className="min-h-screen flex flex-col gap-9 p-8 mx-5 w-full rounded-md bg-[#ffffff69]">
      <h1 className="text-3xl font-bold flex items-center gap-1"><GiProgression size="30"/> Progress</h1>
      <div className="grid gap-5 grid-cols-12">
        <div className="grid col-span-8 gap-5">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 gap-5">
            <div className="w-full  mx-auto p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Progress Meter
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={datachart}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-between -mt-20 px-8">
                <span className="text-green-600 font-bold">{actual}%</span>
                <span className="text-gray-400 font-bold">{planned}%</span>
              </div>
              <p className="text-center text-gray-500 mt-2">
                Actual vs Planned Progress
              </p>
            </div>
            <div class="flex flex-col w-full flex-wrap gap-4">
              {/* <!-- SPI Box --> */}
              <div class="bg-white w-full shadow-md rounded-lg p-4 text-center">
                <div class="text-lg font-semibold mb-2 text-center">
                  SPI (Projection)
                </div>
                <div class="text-2xl mx-auto w-30 font-bold bg-blue-500 text-white rounded-md mb-1">
                  0.74
                </div>
                <div class="text-xs text-gray-400">Projection Index</div>
              </div>
              {/* <!-- Variance Box --> */}
              <div class="bg-white w-full shadow-md rounded-lg p-4 text-center">
                <div class="text-lg font-semibold mb-2 text-center">
                  Variance
                </div>
                <div class="text-2xl mx-auto w-30 font-bold bg-red-500 text-white rounded-md mb-1">
                  19.32%
                </div>
                <div class="text-xs text-gray-400 mb-1">Actual vs Planned</div>
                <div class="text-xs font-semibold text-red-700">
                  Behind planned
                </div>
              </div>
            </div>
          </div>
        <div className="bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      <div className="bg-secondary text-white text-center py-2 rounded-t-xl -mx-4 -mt-4 mb-4 font-semibold">
        Overall Progress S-curve
      </div>

      {/* Chart */}
      <div className="p-4 text-[12px]">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="fillDiff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(239,68,68,0.3)" />
                <stop offset="100%" stopColor="rgba(239,68,68,0)" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => `${value}%`} />

            {/* Shaded area between Planned & Actual */}
            <Area
              type="monotone"
              dataKey="planned"
              stroke="none"
              fill="url(#fillDiff)"
              activeDot={false}
            />

            {/* Planned Line */}
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5, fill: "#3B82F6" }}
              activeDot={{ r: 6 }}
            />

            {/* Actual Line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ r: 5, fill: "#22C55E" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Footer Info */}
      <div className="flex flex-wrap justify-between items-center text-sm font-semibold mt-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
          <span>
            Planned Progress:{" "}
            <span className="text-blue-600">{plannedProgress.toFixed(2)}%</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
          <span>
            Actual Progress:{" "}
            <span className="text-green-600">{actualProgress.toFixed(2)}%</span>
          </span>
        </div>

        <div className="text-red-600 font-semibold">
          Data Date: {dataDate}
        </div>
      </div>
    </div>
        </div>
        <div className="bg-gray-100 mb-auto rounded-xl shadow-lg p-6 col-span-4 mx-auto relative">
          {/* Header with image */}
          <div className="relative flex items-center mb-4">
            <img
              src="https://www.aqi.in/media/sensor-ranges/aqi-moderate-level.svg"
              alt="AQI Mood"
              className="absolute top-0 right-[-1.5rem] w-20 h-20 z-10"
            />
            <h6 className="text-lg font-semibold text-gray-800">
              Air Quality Info
            </h6>
          </div>
          {/* Sensor Info */}
          <div className="mb-4 bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-500">Hardware Sensor</p>
            <p className="text-base font-medium text-gray-800">Neela Gumbad</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Hardware Sensor (NSIT): Live feed and project progress
          </p>

          {/* AQI & Gases */}
          <div className="space-y-4">
            {[
              { name: "AQI", value: 80, unit: "AQI", progress: 8 },
              { name: "PM2.5", value: 26, unit: "µg/m³", progress: 5 },
              { name: "PM10", value: 28, unit: "µg/m³", progress: 6 },
              { name: "CO", value: 816, unit: "ppb", progress: 82 },
              { name: "CO2", value: 500, unit: "ppm", progress: 50 },
              { name: "NO2", value: 12, unit: "ppb", progress: 1 },
              { name: "SO2", value: 30, unit: "ppb", progress: 3 },
              { name: "O3", value: 195, unit: "ppb", progress: 19 },
            ].map((gas, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">
                    {gas.name}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {gas.value}{" "}
                    <span className="text-gray-600">{gas.unit}</span>
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${gas.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* AQI Trend */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">AQI Trend (Last 5 hrs)</p>
            <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">
              {/* Replace this with a chart component like Recharts */}
              <span className="text-gray-400">Chart placeholder</span>
            </div>
          </div>

          {/* AQI Legend */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">AQI Legend</p>
            <div className="flex space-x-1 h-2 mb-1">
              <div className="flex-1 bg-green-500 rounded-sm"></div>
              <div className="flex-1 bg-yellow-500 rounded-sm"></div>
              <div className="flex-1 bg-orange-500 rounded-sm"></div>
              <div className="flex-1 bg-red-500 rounded-sm"></div>
              <div className="flex-1 bg-purple-500 rounded-sm"></div>
              <div className="flex-1 bg-brown-700 rounded-sm"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300</span>
              <span>500+</span>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-500 mt-3">
            Last updated: 2025-09-11T07:40:29.343Z
          </p>
        </div>
      </div>
    </div>
  );
}
