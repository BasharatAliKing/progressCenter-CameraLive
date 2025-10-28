import React, { useState } from "react";
// import LogManager from "../LogManager";
// Updated CSS styles embedded in component
const styles = `
.ruda-container {
    width: 100%;
    // height: 100vh;
    font-family: Arial, sans-serif;
    font-size: 12px;
    display: flex;
    flex-direction: column;
  }

  .ruda-content {
    flex: 1;
    overflow: auto;
  }
  
  .ruda-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #861517;
    color: white;
    padding: 12px 20px;
    margin-bottom: 0;
  }
  
  .ruda-title {
    font-weight: bold;
    font-size: 20px;
    margin: 0;
  }
  
  .ruda-logo {
    color: #c0c0c0;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .ruda-table {
    border-collapse: collapse;
    width: 100%;
    min-width: 1600px;
    border-radius: 0px;
    overflow: hidden;
  }
  .ruda-header {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c4a6b 100%);
    color: white;
    font-weight: bold;
    font-size: 13px;
    padding: 12px 8px;
    border: 1px solid #2c4a6b;
    text-align: center;
    vertical-align: middle;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .ruda-header.phases-packages {
    width: 365px;
    min-width: 365px;
    text-align: left;
    padding-left: 16px;
  }
  .ruda-header.amount-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.duration-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.schedule-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.performance-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.planned-value-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.earned-value-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.actual-start-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-header.actual-finish-column {
    width: 80px;
    min-width: 80px;
  }
  .ruda-month-header {
    background-color: #1e3a5f;
    color: white;
    font-size: 9px;
    padding: 4px 1px;
    border: 1px solid #2c4a6b;
    text-align: center;
  }
  .ruda-phase-header {
    background: linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 100%);
    color: white;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 12px;
    border: 1px solid #5a5a5a;
    text-align: left;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .ruda-phase-row {
    cursor: pointer;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    transition: all 0.3s ease;
  }
  .ruda-phase-row:hover {
    background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  .ruda-package-row {
    cursor: pointer;
    background: linear-gradient(135deg, #e8f4fd 0%, #f1f8ff 100%);
    border-left: 4px solid #3498db;
    transition: all 0.3s ease;
  }
  .ruda-package-row:hover {
    background: linear-gradient(135deg, #d4edda 0%, #e8f4fd 100%);
    border-left: 4px solid #2980b9;
    transform: translateX(2px);
  }
  .ruda-subpackage-row {
    cursor: pointer;
    background: linear-gradient(135deg, #fff8e1 0%, #fffbf0 100%);
    border-left: 4px solid #f39c12;
    transition: all 0.3s ease;
  }

  .ruda-subpackage-row:hover {
    background: linear-gradient(135deg, #ffeaa7 0%, #fff8e1 100%);
    border-left: 4px solid #e67e22;
    transform: translateX(2px);
  }
  
  .ruda-activity-row {
    cursor: pointer;
    background: linear-gradient(135deg, #e8f6f3 0%, #f0f9ff 100%);
    border-left: 3px solid #17a2b8;
    transition: all 0.3s ease;
  }

  .ruda-activity-row:hover {
    background: linear-gradient(135deg, #bee5eb 0%, #e8f6f3 100%);
    border-left: 3px solid #138496;
    transform: translateX(1px);
  }

  .package-cell {
    padding-left: 20px;
    font-weight: bold;
    color: #2c5282;
    font-size: 13px;
  }

  .subpackage-cell {
    padding-left: 36px;
    font-weight: bold;
    color: #d36c2c;
    font-size: 12px;
  }

  .ruda-subsubpackage-row {
    cursor: pointer;
    background: linear-gradient(135deg, #f0f8ff 0%, #f8fbff 100%);
    border-left: 3px solid #6c757d;
    transition: all 0.3s ease;
  }

  .ruda-subsubpackage-row:hover {
    background: linear-gradient(135deg, #b3e5fc 0%, #f0f8ff 100%);
    border-left: 3px solid #495057;
    transform: translateX(1px);
  }

  .ruda-reach-row {
    cursor: pointer;
    background: linear-gradient(135deg, #fdf2f8 0%, #fef7ff 100%);
    border-left: 3px solid #e83e8c;
    transition: all 0.3s ease;
  }

  .ruda-reach-row:hover {
    background: linear-gradient(135deg, #e1bee7 0%, #fdf2f8 100%);
    border-left: 3px solid #d91a72;
    transform: translateX(1px);
  }

  .ruda-material-row {
    cursor: pointer;
    background: linear-gradient(135deg, #f0fff4 0%, #f7fffa 100%);
    border-left: 3px solid #28a745;
    transition: all 0.3s ease;
  }

  .ruda-material-row:hover {
    background: linear-gradient(135deg, #c8e6c9 0%, #f0fff4 100%);
    border-left: 3px solid #1e7e34;
    transform: translateX(1px);
  }
  
  .activity-cell {
    padding-left: 52px;
    color: #1c17aa;
    font-size: 11px;
    font-weight: 500;
  }
  
  .ruda-subsubpackage-row {
    cursor: pointer;
    background-color: #e1f5fe;
  }
  
  .ruda-subsubpackage-row:hover {
    background-color: #b3e5fc;
  }
  
  .ruda-reach-row {
    cursor: pointer;
    background-color: #f3e5f5;
  }
  
  .ruda-reach-row:hover {
    background-color: #e1bee7;
  }
  
  .ruda-material-row {
    cursor: pointer;
    background-color: #e8f5e8;
  }
  
  .ruda-material-row:hover {
    background-color: #c8e6c9;
  }
  
  .subsubpackage-cell {
    padding-left: 52px;
    font-weight: bold;
    color: #0253bd;
    font-size: 12px;
  }

  .reach-cell {
    padding-left: 68px;
    font-weight: bold;
    color: #7b1fa2;
    font-size: 11px;
  }

  .material-cell {
    padding-left: 84px;
    color: #2e7d32;
    font-size: 10px;
    font-weight: 500;
  }
  
  .ruda-separator-row {
    background-color: #e2e8f0;
  }
  
  .ruda-separator-cell {
    padding: 8px 16px;
    font-weight: bold;
    color: #4a5568;
    border: 1px solid #cbd5e0;
  }
  
  .ruda-cell {
    padding: 6px 10px;
    font-size: 11px;
    border: 1px solid #e0e0e0;
    background-color: white;
    text-align: left;
    transition: all 0.2s ease;
  }

  .ruda-cell:hover {
    background-color: #f8f9fa;
    border-color: #ced4da;
  }
  
  .ruda-bold {
    font-weight: bold;
  }
  
  .ruda-timeline-cell {
    position: relative;
    height: 24px;
    border: 1px solid #e0e0e0;
    background-color: #fafafa;
    transition: all 0.2s ease;
  }

  .ruda-timeline-cell:hover {
    background-color: #f0f0f0;
    border-color: #ced4da;
  }

  .ruda-bar {
    position: absolute;
    height: 16px;
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    border-radius: 3px;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
  }

  .ruda-bar:hover {
    background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  
  .ruda-total-cell {
    background-color: #1e3a5f;
    color: white;
    font-weight: bold;
    font-size: 13px;
    padding: 8px 6px;
    border: 1px solid #2c4a6b;
    text-align: center;
  }
  
  .ruda-selected-info {
    background: linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%);
    border: 2px solid #4caf50;
    padding: 20px;
    margin: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .ruda-selected-info:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }

  .ruda-selected-info h3 {
    margin: 0 0 12px 0;
    color: #1e3a5f;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .ruda-selected-info p {
    margin: 8px 0;
    color: #555;
    font-size: 14px;
    line-height: 1.5;
  }

  .ruda-selected-info strong {
    color: #2c3e50;
    font-weight: 600;
  }
  
  .right {
    text-align: right;
  }
  
  .indent {
    padding-left: 12px;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .ruda-container {
      font-size: 10px;
    }

    .ruda-header.phases-packages {
      width: 300px;
      min-width: 300px;
    }

    .ruda-header.amount-column,
    .ruda-header.duration-column,
    .ruda-header.schedule-column,
    .ruda-header.performance-column {
      width: 80px;
      min-width: 80px;
    }
  }

  @media (max-width: 768px) {
    .ruda-container {
      font-size: 9px;
    }

    .ruda-table {
      min-width: 1200px;
    }
  }

  /* Print Styles */
  @media print {
    .ruda-container {
      font-size: 8px;
    }

    .ruda-table {
      min-width: auto;
    }

    .ruda-selected-info {
      display: none;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const DetailedSchedule = () => {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0]));
  const [expandedPackages, setExpandedPackages] = useState(new Set());
  const [expandedSubpackages, setExpandedSubpackages] = useState(new Set());
  const [expandedSubsubpackages, setExpandedSubsubpackages] = useState(
    new Set()
  );
  const [expandedReaches, setExpandedReaches] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showLog, setShowLog] = useState(false);

  const data = [
    {
      project:
        "UPLIFTING OF NEELA GUMBAD AREA ALONG WITH PROVISION OF UNDERGROUND PARKING FACILITY, LAHORE",
      start_date: "10-Oct-25",
      end_date: "10-Jun-26",
      duration: 244,
      tasks: [
        {
          name: "Letter of Acceptance",
          duration: 0,
          start_date: "10-Oct-25",
          end_date: "10-Oct-25",
          subtasks: [
            {
              name: "Letter Of Acceptance",
              duration: 0,
              start_date: "10-Oct-25",
              end_date: "10-Oct-25",
            },
          ],
        },
        {
          name: "Contractual Dates",
          duration: 244,
          start_date: "10-Oct-25",
          end_date: "10-Jun-26",
          subtasks: [
            {
              name: "Start of Project",
              duration: 0,
              start_date: "10-Oct-25",
              end_date: "10-Oct-25",
            },
            {
              name: "Completion of Project",
              duration: 0,
              start_date: "10-Jun-26",
              end_date: "10-Jun-26",
            },
          ],
        },
        {
          name: "Engineer’s Deliverable",
          duration: 50,
          start_date: "10-Oct-25",
          end_date: "28-Nov-25",
          subtasks: [
            {
              name: "Structural Drawings IFCs",
              duration: 0,
              start_date: "10-Oct-25",
              end_date: "10-Oct-25",
            },
            {
              name: "Architectural / MEP Drawings IFCs",
              duration: 0,
              start_date: "10-Oct-25",
              end_date: "10-Oct-25",
            },
            {
              name: "Finishing Drawings IFCs",
              duration: 0,
              start_date: "08-Nov-25",
              end_date: "08-Nov-25",
            },
            {
              name: "Road Works Drawings IFCs",
              duration: 0,
              start_date: "08-Nov-25",
              end_date: "08-Nov-25",
            },
            {
              name: "Ancillary Works IFCs",
              duration: 0,
              start_date: "28-Nov-25",
              end_date: "28-Nov-25",
            },
          ],
        },
        {
          name: "Mobilization",
          duration: 244,
          start_date: "10-Oct-25",
          end_date: "10-Jun-26",
          subtasks: [
            {
              name: "Mobilization of Machinery & Plants",
              duration: 5,
              start_date: "10-Oct-25",
              end_date: "14-Oct-25",
            },
            {
              name: "Mobilization of Staff & Site/Camp Offices",
              duration: 5,
              start_date: "10-Oct-25",
              end_date: "14-Oct-25",
            },
            {
              name: "Provision of Site/Camp Offices & Facilities (LOE)",
              duration: 244,
              start_date: "10-Oct-25",
              end_date: "10-Jun-26",
            },
          ],
        },
        {
          name: "Engineering",
          duration: 71,
          start_date: "10-Oct-25",
          end_date: "19-Dec-25",
          subtasks: [
            {
              name: "Shop Drawings",
              duration: 71,
              start_date: "10-Oct-25",
              end_date: "19-Dec-25",
              subtasks: [
                {
                  name: "Submission",
                  duration: 57,
                  start_date: "10-Oct-25",
                  end_date: "05-Dec-25",
                  subtasks: [
                    {
                      name: "Sub Structure",
                      duration: 28,
                      start_date: "10-Oct-25",
                      end_date: "06-Nov-25",
                      subtasks: [
                        {
                          name: "Shoring & Raft",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Basement-3",
                          duration: 7,
                          start_date: "17-Oct-25",
                          end_date: "23-Oct-25",
                        },
                        {
                          name: "Basement-2",
                          duration: 7,
                          start_date: "24-Oct-25",
                          end_date: "30-Oct-25",
                        },
                        {
                          name: "Basement-1",
                          duration: 7,
                          start_date: "31-Oct-25",
                          end_date: "06-Nov-25",
                        },
                      ],
                    },
                    {
                      name: "Super Structure",
                      duration: 7,
                      start_date: "10-Oct-25",
                      end_date: "16-Oct-25",
                    },
                    {
                      name: "Road Works",
                      duration: 7,
                      start_date: "17-Oct-25",
                      end_date: "23-Oct-25",
                    },
                  ],
                },
                {
                  name: "Approval",
                  duration: 71,
                  start_date: "10-Oct-25",
                  end_date: "19-Dec-25",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const months = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];
  const togglePhase = (phaseIndex) => {
    const newSet = new Set(expandedPhases);
    newSet.has(phaseIndex) ? newSet.delete(phaseIndex) : newSet.add(phaseIndex);
    setExpandedPhases(newSet);
  };

  const togglePackage = (packageKey) => {
    const newSet = new Set(expandedPackages);
    newSet.has(packageKey) ? newSet.delete(packageKey) : newSet.add(packageKey);
    setExpandedPackages(newSet);
  };

  const toggleSubpackage = (subpackageKey) => {
    const newSet = new Set(expandedSubpackages);
    newSet.has(subpackageKey)
      ? newSet.delete(subpackageKey)
      : newSet.add(subpackageKey);
    setExpandedSubpackages(newSet);
  };

  const toggleSubsubpackage = (subsubpackageKey) => {
    const newSet = new Set(expandedSubsubpackages);
    newSet.has(subsubpackageKey)
      ? newSet.delete(subsubpackageKey)
      : newSet.add(subsubpackageKey);
    setExpandedSubsubpackages(newSet);
  };

  const toggleReach = (reachKey) => {
    const newSet = new Set(expandedReaches);
    newSet.has(reachKey) ? newSet.delete(reachKey) : newSet.add(reachKey);
    setExpandedReaches(newSet);
  };

  const handleItemClick = async (item, type = "item") => {
    // Only set timeline for leaf items that have timeline data
    if (item.timeline && Array.isArray(item.timeline)) {
      setSelectedItem(item);

      // Log the view action for demonstration
      try {
        await fetch("https://ruda-planning.onrender.com/api/ganttlog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gantt_item_id:
              item.name?.replace(/\s+/g, "-").toLowerCase() || "unknown",
            gantt_item_name: item.name || "Unknown Item",
            action: "UPDATE",
            field_name: "selected_for_view",
            old_value: null,
            new_value: "Item selected for timeline view",
            changed_by: "User",
          }),
        });
      } catch (error) {
        console.error("Failed to log Gantt action:", error);
      }
    }
  };

  const renderTimeline = (item) => {
    if (!item.timeline || !Array.isArray(item.timeline)) return null;

    const start = item.timeline.findIndex((v) => v === 1);
    const duration = item.timeline.filter((v) => v === 1).length;

    if (start === -1 || duration === 0) return null;

    return (
      <div
        className="ruda-bar"
        style={{
          left: `${start * 18}px`,
          width: `${duration * 18}px`,
        }}
      />
    );
  };

  const formatAmount = (amount) => {
    if (!amount || amount === "0.00") return "-";
    // Convert to millions if it's a large number
    const num = parseFloat(amount.replace(/,/g, ""));
    if (num > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    return amount;
  };

  // Show log component if requested
  if (showLog) {
    return <LogManager onBack={() => setShowLog(false)} />;
  }
  // ✅ Define this BEFORE return (same scope)
  const renderSubtasks = (subtasks, parentKey, level = 1) => {
    return subtasks.map((st, i) => {
      const key = `${parentKey}-${i}`;
      return (
        <React.Fragment key={key}>
          <tr
            className="ruda-subpackage-row"
            onClick={() => toggleSubpackage(key)}
          >
            <td
              className="ruda-cell subpackage-cell"
              style={{ paddingLeft: `${level * 20}px` }}
            >
              {st.name}{" "}
              {st.subtasks && st.subtasks.length > 0
                ? expandedSubpackages.has(key)
                  ? "▲"
                  : "▼"
                : ""}
            </td>
            <td className="ruda-cell right">-</td>
            <td className="ruda-cell right">{st.duration}</td>
            <td className="ruda-cell right">{st.start_date}</td>
            <td className="ruda-cell right">{st.end_date}</td>
            <td colSpan={60} className="ruda-timeline-cell">
              {renderTimeline ? renderTimeline(st) : null}
            </td>
          </tr>

          {/* 🔁 Recursive nesting */}
          {expandedSubpackages.has(key) &&
            st.subtasks &&
            renderSubtasks(st.subtasks, key, level + 1)}
        </React.Fragment>
      );
    });
  };
  return (
    <div className="ruda-container">
      <div className="ruda-header-container">
        <h1 className="ruda-title">{data[0].project}</h1>
      </div>
      <div className="ruda-content">
        <div style={{ position: "relative" }}>
          {/* Move vertical lines outside the table */}
          {/* {[263, 514, 763, 1014, 1264].map((left, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 60,
              left: `${195 + left}px`,
              width: "0.08px",
              height: "88%",
              backgroundColor: "#000000",
              zIndex: 10,
            }}
          />
        ))} */}
          <table className="ruda-table">
            <thead>
              <tr>
                <th className="ruda-header phases-packages" rowSpan="2">
                  Activity Name
                </th>
                <th className="ruda-header amount-column" rowSpan="2">
                  Amount
                  <br />
                  <small>(PKR, M)</small>
                </th>
                <th className="ruda-header duration-column" rowSpan="2">
                  Duration
                  <br />
                  <small>(Days)</small>
                </th>
                <th className="ruda-header actual-start-column" rowSpan="2">
                  Start Date
                </th>
                <th className="ruda-header actual-finish-column" rowSpan="2">
                  Finish Date
                </th>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="ruda-header" colSpan="12">
                    FY {25 + i}-{26 + i}
                  </th>
                ))}
              </tr>
              <tr>
                {months.map((month, index) => (
                  <th key={index} className="ruda-month-header">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((project, pIndex) => (
                <React.Fragment key={pIndex}>
                  {/* Project Row */}
                  <tr
                    className="ruda-phase-row"
                    onClick={() => togglePhase(pIndex)}
                  >
                    <td className="ruda-phase-header">
                      {project.project} {expandedPhases.has(pIndex) ? "▲" : "▼"}
                    </td>
                    <td className="ruda-phase-header right">-</td>
                    <td className="ruda-phase-header right">
                      {project.duration}
                    </td>
                    <td className="ruda-phase-header right">
                      {project.start_date}
                    </td>
                    <td className="ruda-phase-header right">
                      {project.end_date}
                    </td>
                    <td colSpan={60} className="ruda-timeline-cell">
                      <div
                        className="ruda-bar"
                        style={{ left: "0px", width: "216px" }}
                      ></div>
                    </td>
                  </tr>

                  {/* Render Tasks */}
                  {expandedPhases.has(pIndex) &&
                    project.tasks.map((task, tIndex) => (
                      <React.Fragment key={tIndex}>
                        <tr
                          className="ruda-package-row"
                          onClick={() => togglePackage(`${pIndex}-${tIndex}`)}
                        >
                          <td className="ruda-cell package-cell">
                            {task.name}{" "}
                            {expandedPackages.has(`${pIndex}-${tIndex}`)
                              ? "▲"
                              : "▼"}
                          </td>
                          <td className="ruda-cell right">-</td>
                          <td className="ruda-cell right">{task.duration}</td>
                          <td className="ruda-cell right">{task.start_date}</td>
                          <td className="ruda-cell right">{task.end_date}</td>
                          <td colSpan={60} className="ruda-timeline-cell">
                            {renderTimeline ? renderTimeline(task) : null}
                          </td>
                        </tr>

                        {/* Recursive subtasks */}
                        {expandedPackages.has(`${pIndex}-${tIndex}`) &&
                          task.subtasks &&
                          renderSubtasks(task.subtasks, `${pIndex}-${tIndex}`)}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}

              <tr>
                <td className="ruda-total-cell">Total</td>
                <td className="ruda-total-cell right">0</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td className="ruda-total-cell right">-</td>
                <td colSpan={60} className="ruda-total-cell"></td>
              </tr>
            </tbody>
          </table>
        </div>
        {selectedItem && (
          <div className="ruda-selected-info">
            <h3>Selected Item: {selectedItem.name}</h3>
            <p>Timeline visualization updated above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedSchedule;
