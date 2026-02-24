import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FinancialStatusDashboard = ({ certifiedPaymentsData, cashFlowData }) => {
  const defaultCertifiedData = [
    { category: "Advance Recovery", certified: 7, balance: 1.2, total: 2.8 },
    {
      category: "General Requirements",
      certified: 4.4,
      balance: 3.2,
      total: 4.4,
    },
    { category: "Building Works", certified: 17.0, balance: 28.7, total: 45.7 },
    { category: "MEP Package", certified: 19.9, balance: 12.4, total: 32.3 },
    { category: "Provisional Sums", certified: 5.6, balance: 0, total: 5.6 },
    { category: "Retention", certified: 2.8, balance: 0, total: 2.8 },
    { category: "Total", certified: 21.8, balance: 56.4, total: 78.2 },
  ];

  const defaultCashFlowData = [
    { month: "Apr23", planned: 679.1, actual: 504.9 },
    { month: "May23", planned: 5.2, actual: 3.8 },
    { month: "Jun23", planned: 6.1, actual: 4.2 },
    { month: "Jul23", planned: 7.8, actual: 6.1 },
    { month: "Aug23", planned: 444, actual: 2.9 },
    { month: "Sep23", planned: 3.2, actual: 1.8 },
    { month: "Oct23", planned: 2.8, actual: 1.5 },
    { month: "Nov23", planned: 356, actual: 2.0 },
    { month: "Dec23", planned: 4.3, actual: 3.5 },
    { month: "Jan24", planned: 2.1, actual: 1.8 },
    { month: "Feb24", planned: 2.3, actual: 2.2 },
    { month: "Mar24", planned: 50, actual: 2.4 },
    { month: "Apr24", planned: 1.8, actual: 986.2 },
    { month: "May24", planned: 2.4, actual: 1.4 },
    { month: "Jun24", planned: 2.6, actual: 1.1 },
    { month: "Jul24", planned: 2.5, actual: 1.1 },
    { month: "Aug24", planned: 3.6, actual: 2.4 },
    { month: "Sep24", planned: 4.0, actual: 3.2 },
    { month: "Oct24", planned: 3.5, actual: 2.8 },
    { month: "Nov24", planned: 4.2, actual: 3.6 },
    { month: "Dec24", planned: 5.0, actual: 4.1 },
    { month: "Jan25", planned: 6.0, actual: 5.2 },
    { month: "Feb25", planned: 7.5, actual: 6.8 },
    { month: "Mar25", planned: 7.8, actual: 7.1 },
  ];

  const certifiedData = certifiedPaymentsData || defaultCertifiedData;
  const cashData = cashFlowData || defaultCashFlowData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-amber-50 p-2 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}M`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CashFlowTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-amber-50 p-2 border border-gray-300 rounded">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey === "planned" ? "Planned" : "Actual"}: ${
                entry.value
              }M`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const truncateLabel = (label) => {
    return label.length > 8 ? `${label.slice(0, 6)}…` : label;
  };

  return (
    <div className="w-full bg-amber-50 p-4 rounded-lg">
      <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
        FINANCIAL STATUS
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Certified Payments */}
        <div className="flex-1 bg-amber-50 rounded-lg p-3 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Certified Payments
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={certifiedData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickFormatter={truncateLabel}
                fontSize={11}
              />
              <YAxis tickFormatter={(value) => `${value}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="certified" stackId="a" fill="#3B82F6" />
              <Bar dataKey="balance" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow */}
        <div className="flex-1 bg-amber-50 rounded-lg p-3 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Cash Flow
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={cashData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={truncateLabel}
                fontSize={11}
              />
              <YAxis tickFormatter={(value) => `${value}M`} />
              <Tooltip content={<CashFlowTooltip />} />
              <Bar dataKey="planned" fill="#3B82F6" />
              <Bar dataKey="actual" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatusDashboard;
