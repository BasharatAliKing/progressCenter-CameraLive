import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Calendar, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const AISafetyAnalize = () => {
  const chartRef = useRef(null);
  const tooltipElRef = useRef(null);

  // 🗓️ Date states
  const [fromDate, setFromDate] = useState(new Date(2025, 8, 27));
  const [toDate, setToDate] = useState(new Date(2025, 9, 16));
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedSafety, setSelectedSafety] = useState("Overall Safety");

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const menuRef = useRef(null);

  // 🔹 Hide dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !fromRef.current?.contains(event.target) &&
        !toRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setShowFromCalendar(false);
        setShowToCalendar(false);
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧊 Custom tooltip with image
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "custom-tooltip";
    Object.assign(el.style, {
      position: "absolute",
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "8px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.2s ease",
      textAlign: "center",
      zIndex: "9999",
    });
    el.innerHTML = `
      <img src="/card-1.jpg" alt="Safety"
           style="width:90px; height:50px; object-fit:cover; border-radius:6px; margin-bottom:4px;" />
      <div style="font-size:12px; font-weight:600; color:#1e293b;">Safety 0%</div>
    `;
    document.body.appendChild(el);
    tooltipElRef.current = el;
    return () => el.remove();
  }, []);

  // 🔹 Chart Data
  const labels = [
    "27 Sep 25", "28 Sep 25", "29 Sep 25", "30 Sep 25", "01 Oct 25",
    "02 Oct 25", "03 Oct 25", "04 Oct 25", "05 Oct 25", "06 Oct 25",
    "07 Oct 25", "08 Oct 25", "09 Oct 25", "10 Oct 25", "11 Oct 25",
    "12 Oct 25", "13 Oct 25", "14 Oct 25", "15 Oct 25", "16 Oct 25",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: selectedSafety,
        data: [
          15, 22, 40, 35, 28, 30, 33, 45, 18, 31,
          32, 22, 15, 8, 21, 5, 14, 16, 11, 19,
        ],
        backgroundColor: "#2563eb",
        borderRadius: 6,
        barPercentage: 0.6, // ✅ Adjust width of bars
        categoryPercentage: 0.7, // ✅ Ensure even spacing between bars
      },
    ],
  };

  // 🔧 Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: (context) => {
          const tooltipModel = context.tooltip;
          const tooltipEl = tooltipElRef.current;
          if (!tooltipEl || !chartRef.current) return;

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          const chartCanvas = chartRef.current.canvas;
          const rect = chartCanvas.getBoundingClientRect();
          const value = tooltipModel.dataPoints?.[0]?.formattedValue || "0";
          tooltipEl.querySelector("div").innerText = `${selectedSafety} ${value}%`;

          const positionY = rect.top + window.scrollY + tooltipModel.caretY - 90;
          const positionX = rect.left + window.scrollX + tooltipModel.caretX - 45;

          tooltipEl.style.left = `${positionX}px`;
          tooltipEl.style.top = `${positionY}px`;
          tooltipEl.style.opacity = "1";
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#475569",
          font: { size: 11 },
          maxRotation: -310,
          minRotation: -310,
          autoSkip: false, // ✅ show all dates clearly
          align: "center", // ✅ ensures label is under bar
          crossAlign: "far",
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (val) => `${val}%`,
          color: "#475569",
        },
        grid: { color: "#e2e8f0" },
      },
    },
    layout: {
      padding: { bottom: 40 }, // ✅ ensures enough space for angled labels
    },
  };

  // 🔹 Dropdown menu items
  const menuItems = ["Overall Safety", "Hard Hat", "Safety Vest"];

  return (
    <div className="flex flex-col gap-5">
    <div className="flex">
          {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800">
          AI Safety Analysis
        </h2>
  <div className="flex gap-3 ml-auto">
    {/* From Date */}
          <div
            ref={fromRef}
            className="relative flex items-center gap-2 bg-white rounded-md px-3 py-2 shadow-sm cursor-pointer"
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
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg z-20 p-3">
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
            className="relative flex items-center gap-2 bg-white rounded-md px-3 py-2 shadow-sm cursor-pointer"
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
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg z-20 p-3">
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
    <div className="bg-[#f8fafc] rounded-2xl shadow-lg p-6">
      {/* 🔹 Header with title & filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      
        {/* Right Filters */}
        <div className="flex flex-wrap gap-3 items-center">
        

          {/* Ranking Badge */}
          <div className="bg-yellow-100 text-sm text-gray-800 rounded-md px-3 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-yellow-500">⭐</span> PPE Ranking: <b>1.1</b>
          </div>

          {/* Safety Type Dropdown */}
          <div ref={menuRef} className="relative">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white text-sm text-gray-800 rounded-md px-3 py-1.5 shadow-sm flex items-center gap-1 cursor-pointer hover:bg-gray-100"
            >
              {selectedSafety} <ChevronDown size={14} />
            </div>

            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-20 w-40">
                {menuItems.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setSelectedSafety(item);
                      setShowMenu(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                      selectedSafety === item
                        ? "bg-blue-100 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 🔹 Chart Section */}
      <div className="h-[420px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      {/* Chart Label Outside */}
      <div className="text-center -mt-5 text-sm font-medium text-gray-600">
        ● {selectedSafety} Trend ({format(fromDate, "dd MMM")} - {format(toDate, "dd MMM")})
      </div>
    </div>
    </div>
  );
};
export default AISafetyAnalize;
