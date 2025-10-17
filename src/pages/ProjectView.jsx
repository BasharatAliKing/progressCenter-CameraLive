import { Cctv, Tv } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

  const stats = [
    { title: "Total Sales", value: "$612,917", desc: "Products vs last month", change: 2.08, positive: true },
    { title: "Total Orders", value: "34,760", desc: "Orders vs last month", change: 4.29, positive: true },
    { title: "Visitor", value: "14,987", desc: "Users vs last month", change: 2.08, positive: false },
    { title: "Total Sold Products", value: "12,987", desc: "Products vs last month", change: 12.19, positive: true },
  ];

  const customerHabits = [
    { month: "Jan", seen: 40000, sales: 38000 },
    { month: "Feb", seen: 48000, sales: 42000 },
    { month: "Mar", seen: 42000, sales: 40000 },
    { month: "Apr", seen: 39000, sales: 36000 },
    { month: "May", seen: 45000, sales: 41000 },
    { month: "Jun", seen: 47000, sales: 43000 },
  ];

  const productStats = [
    { name: "Electronic", value: 2487, change: 1.8 },
    { name: "Games", value: 1828, change: 2.3 },
    { name: "Furniture", value: 1463, change: -5.1 },
  ];

  const customerGrowth = [
    { country: "United States", value: 2417 },
    { country: "Germany", value: 2281 },
    { country: "Australia", value: 812 },
    { country: "France", value: 287 },
  ];

  const COLORS = ["#6366F1", "#22C55E", "#EF4444"];

  const StatCard = ({ title, value, desc, change, positive, highlight }) => (
    <div className={`p-6 rounded-2xl shadow-md ${highlight ? "bg-indigo-600 text-white" : "bg-white"}`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className={`text-xs mt-1 ${highlight ? "text-white/80" : "text-gray-500"}`}>{desc}</div>
      <div
        className={`mt-2 text-sm font-semibold ${
          positive ? "text-green-500" : "text-red-500"
        }`}
      >
        {positive ? `▲ ${change}%` : `▼ ${change}%`}
      </div>
    </div>
  );
export default function ProjectView() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold">Sales Report</h1>
      <div className="flex py-5">
        <button className="p-2 rounded-md text-white flex items-center font-medium gap-1 bg-primary cursor-pointer"><Cctv size="20" /> Live </button>
      </div>
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard {...stats[0]} highlight />
        <StatCard {...stats[1]} />
        <StatCard {...stats[2]} />
        <StatCard {...stats[3]} />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Habits */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Customer Habits</h3>
            <span className="text-sm text-gray-400">This Year</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={customerHabits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="seen" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <span className="mr-4">Seen Product: <strong>43,787</strong></span>
            <span>Sales: <strong>39,784</strong></span>
          </div>
        </div>

        {/* Product Statistics */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Product Statistic</h3>
            <span className="text-sm text-gray-400">Today</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={productStats}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={4}
              >
                {productStats.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-4 space-y-2">
            {productStats.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className={`${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {item.value} ({item.change >= 0 ? "▲" : "▼"}{Math.abs(item.change)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Customer Growth</h3>
            <span className="text-sm text-gray-400">Today</span>
          </div>
          <ul className="space-y-3">
            {customerGrowth.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b last:border-none pb-2"
              >
                <span>{item.country}</span>
                <span className="font-semibold">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
