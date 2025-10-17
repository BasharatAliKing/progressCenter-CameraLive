import React, { useEffect, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

// 🔹 Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-1 rounded-md shadow-md border border-gray-200 flex flex-col items-center">
        <img
          src="/card-1.jpg"
          alt="Activity Icon"
          className="w-16 h-10 mb-2"
        />
        <p className="text-xs font-semibold text-gray-800">
          Activity {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};
const AIEquipmentTracking = () => {
     const [fromDate, setFromDate] = useState(new Date(2025, 8, 27));
  const [toDate, setToDate] = useState(new Date(2025, 9, 16));
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromRef.current &&
        !fromRef.current.contains(event.target) &&
        toRef.current &&
        !toRef.current.contains(event.target)
      ) {
        setShowFromCalendar(false);
        setShowToCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Dummy Data
  const lineData = [
    { date: "27 Sep", value: 67 },
    { date: "28 Sep", value: 74 },
    { date: "29 Sep", value: 79 },
    { date: "30 Sep", value: 82 },
    { date: "01 Oct", value: 81 },
    { date: "02 Oct", value: 77 },
    { date: "03 Oct", value: 83 },
    { date: "04 Oct", value: 79 },
    { date: "05 Oct", value: 84 },
    { date: "06 Oct", value: 78 },
    { date: "07 Oct", value: 81 },
    { date: "08 Oct", value: 80 },
    { date: "09 Oct", value: 85 },
    { date: "10 Oct", value: 79 },
    { date: "11 Oct", value: 77 },
    { date: "12 Oct", value: 83 },
    { date: "13 Oct", value: 81 },
    { date: "14 Oct", value: 86 },
    { date: "15 Oct", value: 84 },
    { date: "16 Oct", value: 71 },
  ];

  const scatterData = lineData.flatMap((d) => [
    { date: d.date, time: "6:00 AM" },
    { date: d.date, time: "10:00 AM" },
    { date: d.date, time: "2:00 PM" },
    { date: d.date, time: "6:00 PM" },
  ]);

  const tempData = lineData.map((d) => ({
    date: d.date,
    max: 40,
    min: 25,
  }));

  return (
    <>
    <div className="flex">
              {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800">
              AI Equipment tracking
            </h2>
      <div className="flex gap-3 ml-auto">
        {/* 🔹 Date Filters */}
        <div className="flex justify-end gap-3 mb-6 relative">
          {/* From Date */}
          <div
            ref={fromRef}
            className="relative flex items-center gap-2 bg-[#e5e7eb] rounded-md px-3 py-2 shadow-sm cursor-pointer"
            onClick={() => {
              setShowFromCalendar(!showFromCalendar);
              setShowToCalendar(false);
            }}
          >
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">
              {format(fromDate, "dd MMM, yyyy")}
            </span>

            {showFromCalendar && (
              <div className="absolute top-12 right-0 bg-[#e5e7eb] rounded-lg shadow-lg z-20 p-3">
                <DayPicker
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    if (date) setFromDate(date);
                    setShowFromCalendar(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* To Date */}
          <div
            ref={toRef}
            className="relative flex items-center gap-2 bg-[#e5e7eb] rounded-md px-3 py-2 shadow-sm  cursor-pointer"
            onClick={() => {
              setShowToCalendar(!showToCalendar);
              setShowFromCalendar(false);
            }}
          >
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">
              {format(toDate, "dd MMM, yyyy")}
            </span>

            {showToCalendar && (
              <div className="absolute top-12 right-0 bg-[#e5e7eb] rounded-lg shadow-lg z-20 p-3">
                <DayPicker
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    if (date) setToDate(date);
                    setShowToCalendar(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
       {/* 🔹 Chart Container Style */}
        <div className="grid gap-8">
          {/* Chart 1: AI People Flow */}
          <div className="bg-[#e5e7eb] rounded-2xl shadow p-5">
            <h2 className="text-md font-medium mb-4 text-gray-700">
              AI People Flow
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ top: 10, right: 20, bottom: 60, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis
                  dataKey="date"
                  interval={0}
                  tick={{
                    angle: 310,
                    textAnchor: "end",
                    fontSize: 12,
                    fill: "#4b5563",
                  }}
                  height={80}
                  tickMargin={10}
                  tickFormatter={(date) => `${date} 25`}
                />
                <YAxis hide domain={[60, 90]} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-center -mt-10 text-sm md:text-base font-medium text-gray-600">
              ● Total Activity
            </div>
          </div>
          {/* Chart 2: Activity (Scatter) */}
          {/* Chart 3: Temperature */}
{/* 🌡️ Temperature Overview (Enhanced Professional Design) */}
<div className="bg-[#e5e7eb] rounded-2xl shadow-lg p-6">
  {/* Header */}
  <div className="flex justify-between items-center mb-5">
    <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      🌡️ Temperature Overview
    </div>
    <select className="border border-gray-200 rounded-lg text-sm px-3 py-1.5 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
      <option>Temperature</option>
      <option>Humidity</option>
      <option>Pressure</option>
    </select>
  </div>

  {/* Chart */}
  <ResponsiveContainer width="100%" height={340}>
    <LineChart data={tempData} margin={{ top: 20, right: 30, bottom: 60, left: 0 }}>
      {/* Gradients */}
      <defs>
        <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
        </linearGradient>
      </defs>

      {/* Grid */}
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

      {/* X-Axis */}
      <XAxis
        dataKey="date"
        interval={0}
        tick={{
          angle: 310,
          textAnchor: "end",
          fontSize: 12,
          fill: "#4b5563",
        }}
        height={80}
        tickMargin={10}
      />

      {/* Y-Axis */}
      <YAxis
        tick={{ fill: "#4b5563", fontSize: 12 }}
        axisLine={false}
        tickLine={false}
        width={40}
      />

      {/* Tooltip */}
      <Tooltip
        contentStyle={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          padding: "10px 12px",
        }}
        labelStyle={{ color: "#111827", fontWeight: "600" }}
        formatter={(value, name) => [`${value}°C`, name === "max" ? "Max Temp" : "Min Temp"]}
      />

      {/* Lines */}
      <Line
        type="monotone"
        dataKey="max"
        stroke="url(#maxTempGradient)"
        strokeWidth={3}
        dot={{
          r: 5,
          fill: "#ef4444",
          strokeWidth: 2,
          stroke: "white",
          filter: "drop-shadow(0 0 6px rgba(239,68,68,0.5))",
        }}
        activeDot={{ r: 7 }}
        isAnimationActive
      />
      <Line
        type="monotone"
        dataKey="min"
        stroke="url(#minTempGradient)"
        strokeWidth={3}
        dot={{
          r: 5,
          fill: "#2563eb",
          strokeWidth: 2,
          stroke: "white",
          filter: "drop-shadow(0 0 6px rgba(37,99,235,0.5))",
        }}
        activeDot={{ r: 7 }}
        isAnimationActive
      />
    </LineChart>
  </ResponsiveContainer>

  {/* Legend */}
  <div className="flex justify-center -mt-10 gap-8 text-sm font-medium text-gray-600">
    <span className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-300"></span> Max Temp
    </span>
    <span className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-300"></span> Min Temp
    </span>
  </div>
</div>


          
        </div>
    </>
  )
}

export default AIEquipmentTracking
