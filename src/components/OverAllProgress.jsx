import { Cctv, Tv, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { GiProgression } from "react-icons/gi";
import { useParams } from "react-router-dom";
import * as XLSX from 'xlsx';
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
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
  const plannedProgress = data[data.length - 1].planned;
  const actualProgress = data[data.length - 1].actual;
  const dataDate = "10-Sep-25";
const COLORS = ["#6366F1", "#22C55E", "#EF4444"];

export default function OverAllProgress() {
  const params=useParams();
   const [allCameras, setAllCameras] = useState([]);
   const [OneCamera,setOneCamera]=useState(null);
    const [aqi, setAqi] = useState(null);
    const [aqiLatest, setAqiLatest] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);
    const [exportError, setExportError] = useState('');
    const latestdataAqi=aqiLatest?.air_quality;
    const fetchCameras = async () => {
      try {
        const res = await fetch(`${API_URL}/camera`);
        const data = await res.json();
        if (data?.cameras) {
          setAllCameras(data.cameras);
          const foundCamera = data.cameras.find((cam) => cam._id === params.id);          
          setOneCamera(foundCamera);
          setAqi(foundCamera?.aqiData || []);
          // Extract latest AQI
     if (foundCamera?.aqiData?.length > 0) {
  // Sort AQI records by creation time (latest first)
  const sorted = [...foundCamera.aqiData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pick the most recent AQI entry (the one last added to DB)
  const latest = sorted[0];
  setAqiLatest(latest);
}
        }
        
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    useEffect(()=>{
      fetchCameras();
    },[]);

// Excel export handler
const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => {
    const out = {}
    Object.entries(row || {}).forEach(([k, v]) => {
      if (v === null || v === undefined) {
        out[k] = ''
      } else if (Array.isArray(v)) {
        out[k] = JSON.stringify(v)
      } else if (typeof v === 'object') {
        out[k] = JSON.stringify(v)
      } else {
        out[k] = v
      }
    })
    return out
  })
}

const handleExportAQI = async () => {
  setExportError('')
  setExportLoading(true)
  try {
    const res = await fetch('/aqi', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }
    const text = await res.text()
    if (text.trim().startsWith('<')) throw new Error('Server returned HTML instead of JSON')
    const json = JSON.parse(text)
    const data = Array.isArray(json) ? json : (json?.data || json?.results || json?.items || [])
    if (!Array.isArray(data) || data.length === 0) throw new Error('No data returned from API')

    const rows = normalizeRows(data)
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'AQI')

    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    const fileName = `AQI-export-${stamp}.xlsx`
    XLSX.writeFile(wb, fileName)
  } catch (e) {
    const msg = e?.message || 'Failed to export'
    const hint = msg.includes('Failed to fetch') || e?.name === 'TypeError'
      ? ' (Possible CORS or network issue)'
      : ''
    setExportError(`${msg}${hint}`)
  } finally {
    setExportLoading(false)
  }
}

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
            <div className="flex flex-col w-full flex-wrap gap-4">
              {/* <!-- SPI Box --> */}
              <div className="bg-white w-full shadow-md rounded-lg p-4 text-center">
                <div className="text-lg font-semibold mb-2 text-center">
                  SPI (Projection)
                </div>
                <div className="text-2xl mx-auto w-30 font-bold bg-blue-500 text-white rounded-md mb-1">
                  0.74
                </div>
                <div className="text-xs text-gray-400">Projection Index</div>
              </div>
              {/* <!-- Variance Box --> */}
              <div className="bg-white w-full shadow-md rounded-lg p-4 text-center">
                <div className="text-lg font-semibold mb-2 text-center">
                  Variance
                </div>
                <div className="text-2xl mx-auto w-30 font-bold bg-red-500 text-white rounded-md mb-1">
                  19.32%
                </div>
                <div className="text-xs text-gray-400 mb-1">Actual vs Planned</div>
                <div className="text-xs font-semibold text-red-700">
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
          <div className="relative flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h6 className="text-lg font-semibold text-gray-800">
                Air Quality Info
              </h6>
            </div>
            <button
              onClick={handleExportAQI}
              disabled={exportLoading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                exportLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
              title="Download all AQI data as Excel"
            >
              <Download size={16} />
              {exportLoading ? 'Exporting...' : 'Export Excel'}
            </button>
            <img
              src="https://www.aqi.in/media/sensor-ranges/aqi-moderate-level.svg"
              alt="AQI Mood"
              className="absolute top-10 right-[-0.5rem] w-20 h-20 z-10"
            />
          </div>
          {exportError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {exportError}
            </div>
          )}
          {/* Sensor Info */}
          <div className="mb-4 bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-500">Hardware Sensor</p>
            <p className="text-base font-medium text-gray-800">{OneCamera?.location}</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Hardware Sensor ({OneCamera?.location}): Live feed and project progress
          </p>

          {/* AQI & Gases */}
     <div className="space-y-4">
  {latestdataAqi && (
    <>
      {[
        { name: "PM2.5", value: latestdataAqi.pm2_5, unit: "µg/m³" },
        { name: "PM10", value: latestdataAqi.pm10, unit: "µg/m³" },
        { name: "CO", value: latestdataAqi.co, unit: "ppb" },
        { name: "CO2", value: latestdataAqi.co2, unit: "ppm" },
        { name: "NO2", value: latestdataAqi.no2, unit: "ppb" },
        { name: "SO2", value: latestdataAqi.so2, unit: "ppb" },
        { name: "O3", value: latestdataAqi.o3, unit: "ppb" },
        { name: "Humidity", value: latestdataAqi.hum, unit: "%" },
        { name: "Temperature", value: latestdataAqi.temp, unit: "°C" },
      ].map((gas, idx) => {
        // 🌈 Determine color based on AQI-like value
        const getAqiColor = (value) => {
          if (value <= 50) return "bg-[#248606]";
          if (value <= 100) return "bg-[#44e508]";
          if (value <= 150) return "bg-[#E9CF3C]";
          if (value <= 200) return "bg-[#c98800]";
          if (value <= 300) return "bg-[#ea0a08]";
          if (value <= 400) return "bg-[#9008dc]";
          return "bg-[#910003]"; // for 300+
        };

        // 🧮 Progress bar width (normalized)
        const progress = Math.min((gas.value / 500) * 100, 100);
        const color = getAqiColor(gas.value);

        return (
          <div key={idx}>
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium text-gray-700">{gas.name}</p>
              <p className="text-sm font-semibold text-gray-800">
                {gas.value}
                <span className="text-gray-600"> {gas.unit}</span>
              </p>
            </div>

            {/* ✅ Colored progress bar */}
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${color}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </>
  )}
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
              <div className="flex-1 bg-[#248606] rounded-sm"></div>
              <div className="flex-1 bg-[#44e508] rounded-sm"></div>
              <div className="flex-1 bg-[#e9cf3c] rounded-sm"></div>
              <div className="flex-1 bg-[#c98800] rounded-sm"></div>
              <div className="flex-1 bg-[#ea0a08] rounded-sm"></div>
              <div className="flex-1 bg-[#9008dc] rounded-sm"></div>
              <div className="flex-1 bg-[#910003] rounded-sm"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500+</span>
            </div>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-500 mt-3">
            Last updated: {aqiLatest?.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
