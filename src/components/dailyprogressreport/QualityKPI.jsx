import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const EngineeringQualityKPIs = (data) => {
  console.log(data.data);
  const engineeringData = data.data;
  const groupedByKpi = engineeringData?.reduce((acc, item) => {
    if (!acc[item.kpi_name]) {
      acc[item.kpi_name] = [];
    }
    acc[item.kpi_name].push(item);
    return acc;
  }, {});
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
    <div className="w-full bg-[#e7e4dc] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        ENGINEERING QUALITY KPIs
      </h2>

      {/* KPI Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* KPI Data Submission Performance */}
        {Object.entries(groupedByKpi || {}).map(([kpiName, rows], i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <h3 className="font-bold text-sm text-gray-800 mb-3">{kpiName}</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#e7e4dc]">
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
                  {rows.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-[#e7e4dc]" : "bg-white"}
                    >
                      <td className="border border-gray-300 px-2 py-2">
                        {item.category}
                      </td>

                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {item.responsibility}
                      </td>

                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {item.planned_to_date}
                      </td>

                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {item.released_to_date}
                      </td>

                      <td className="border border-gray-300 px-2 py-2 text-center font-medium">
                        {item.performance_percentage_actual_planned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedByKpi || {}).map(([kpiName, rows]) =>
          rows.map((item, index) => {
            const pieData = item.status.map((s, i) => ({
              name: s.status_name,
              value: Number(s.status_value),
              color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][i % 4],
            }));

            const total = pieData.reduce((sum, v) => sum + v.value, 0);

            return (
              <PieChartSection
                key={index}
                title={`${item.category} STATUS`}
                data={pieData}
                totalLabel={`Total ${item.category}`}
                totalValue={`= ${total}`}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default EngineeringQualityKPIs;
