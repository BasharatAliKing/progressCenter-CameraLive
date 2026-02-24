import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const EngineeringQualityKPIs = ({
  // KPI Table Data
  kpiData = [
    {
      category: "Prequalifications",
      responsibility: "Contractor",
      planned: 32,
      released: 30,
      performance: 93.75,
    },
    {
      category: "Shop/Drawings",
      responsibility: "Contractor",
      planned: 428,
      released: 442,
      performance: 103.27,
    },
    {
      category: "Material Submittals",
      responsibility: "Contractor",
      planned: 255,
      released: 253,
      performance: 99.22,
    },
  ],

  // RFI Response Performance
  rfiResponseData = [
    {
      category: "NCR",
      responsibility: "Consultant",
      totalIncluding: 0,
      responseOverdue: 0,
      performance: 100.0,
    },
    {
      category: "RFI",
      responsibility: "Consultant",
      totalIncluding: 67,
      responseOverdue: 0,
      performance: 100.0,
    },
    {
      category: "Submittals",
      responsibility: "Consultant",
      totalIncluding: 725,
      responseOverdue: 0,
      performance: 100.0,
    },
  ],

  // Pie Chart Data
  rfiStatusData = [
    { name: "Closed RFI", value: 60, color: "#3b82f6" },
    { name: "Under Review RFI", value: 6, color: "#ef4444" },
    { name: "Overdue RFI", value: 1, color: "#f59e0b" },
  ],

  voStatusData = [
    { name: "Closed Vos", value: 1, color: "#3b82f6" },
    { name: "Under Review Vos", value: 6, color: "#ef4444" },
  ],

  shopDrawingData = [
    { name: "Total Approved", value: 336, color: "#10b981" },
    { name: "Total Rejected / Resubmit", value: 6, color: "#ef4444" },
    { name: "Total Under Review", value: 25, color: "#f59e0b" },
    { name: "Total for Info", value: 6, color: "#6b7280" },
    { name: "Overdue Submittals", value: 50, color: "#0000FF" },
  ],

  prequalificationData = [
    { name: "Total Approved", value: 29, color: "#10b981" },
    { name: "Total Rejected / Resubmit", value: 1, color: "#ef4444" },
    { name: "Total Under Review", value: 0, color: "#f59e0b" },
    { name: "Overdue Submittals", value: 0, color: "#dc2626" },
  ],

  materialSubmittalData = [
    { name: "Total Approved", value: 186, color: "#10b981" },
    { name: "Total Rejected / Resubmit", value: 67, color: "#ef4444" },
    { name: "Total Under Review", value: 0, color: "#f59e0b" },
    { name: "Overdue Submittals", value: 0, color: "#0000FF" },
  ],

  ncrStatusData = [
    { name: "Open NCRs", value: 1, color: "#ef4444" },
    { name: "Closed NCRs", value: 1, color: "#10b981" },
  ],
}) => {
  const formatPercentage = (value) => `${value?.toFixed(2)}%`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">
            Value: <span className="font-semibold">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const PieChartSection = ({ title, data, totalLabel, totalValue }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-bold text-sm text-gray-800 mb-3 text-center">
        {title}
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <div className="text-center font-bold text-sm text-gray-800 mb-2">
          {totalLabel}: {totalValue}
        </div>
        <div className="space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-amber-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        ENGINEERING QUALITY KPIs
      </h2>

      {/* KPI Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* KPI Data Submission Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-bold text-sm text-gray-800 mb-3">
            KPI Data Submission Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    Category
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Responsibility
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Planned to date (Nos)
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Released to date (Nos)
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Performance % (Actual/Planned)
                  </th>
                </tr>
              </thead>
              <tbody>
                {kpiData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-amber-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-2 py-2">
                      {item.category}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {item.responsibility}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {item.planned}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {item.released}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                      {formatPercentage(item.performance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RFI Response Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-bold text-sm text-gray-800 mb-3">
            RFI Response Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-amber-50">
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                    Category
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Responsibility
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Total Including Approved (Nos)
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Response Overdue (Nos)
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                    Performance % (Response/Total)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rfiResponseData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-amber-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-2 py-2">
                      {item.category}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {item.responsibility}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {item.totalIncluding}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {item.responseOverdue}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                      {formatPercentage(item.performance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PieChartSection
          title="RFI STATUS"
          data={rfiStatusData}
          totalLabel="Total No. of RFIs Submitted"
          totalValue="= 67"
        />

        <PieChartSection
          title="VO STATUS"
          data={voStatusData}
          totalLabel="Total No. of VOs Submitted"
          totalValue="= 7"
        />

        <PieChartSection
          title="SHOP DRAWING STATUS"
          data={shopDrawingData}
          totalLabel="Total No. of Shop drawing Submitted"
          totalValue="= 367"
        />

        <PieChartSection
          title="PREQUALIFICATION STATUS"
          data={prequalificationData}
          totalLabel="Total No. of Prequalification Submitted"
          totalValue="= 30"
        />

        <PieChartSection
          title="MATERIAL SUBMITTAL STATUS"
          data={materialSubmittalData}
          totalLabel="Total No. of Material Submitted"
          totalValue="= 253"
        />

        <PieChartSection
          title="NCR STATUS"
          data={ncrStatusData}
          totalLabel="Total NCR"
          totalValue="= 2"
        />
      </div>
    </div>
  );
};

export default EngineeringQualityKPIs;
