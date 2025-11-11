import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
// import LogManager from "../LogManager";
// Updated CSS styles embedded in component
const styles = `
:root{
  --ruda-primary: #5b4fc2;
  --ruda-accent: #ff7a59;
  --ruda-accent-2: #00b5ad;
  --ruda-muted: #6b7280;
  --ruda-bg: #f6f9fc;
  --ruda-card: #ffffff;
  --ruda-text: #0f1724;
}
.ruda-container{
  width:100%;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  font-size:13px;
  color:var(--ruda-text);
  background:var(--ruda-bg);
  display:flex;
  flex-direction:column;
}
.ruda-content{padding:16px}
.ruda-header-container{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;background:linear-gradient(135deg,#5546d4,#7160e8);color:#fff;border-radius:0;box-shadow:none;gap:20px}
.ruda-header-left{display:flex;align-items:center;gap:16px;flex:1}
.ruda-header-logo{height:40px;width:auto;object-fit:contain}
.ruda-title{font-size:16px;font-weight:600;margin:0;letter-spacing:0.3px;text-transform:uppercase;flex:1}
.ruda-table-wrapper{width:100%;overflow-x:auto;position:relative}
.ruda-table{width:100%;border-collapse:separate;border-spacing:0;background:var(--ruda-card);border-radius:0;box-shadow:none;border:1px solid #e5e7eb}
.ruda-table thead th{background:#f9fafb;padding:12px 16px;font-weight:600;color:#374151;font-size:11px;border-bottom:2px solid #e5e7eb;text-transform:uppercase;letter-spacing:0.5px;position:sticky;top:0;z-index:10;white-space:nowrap}
.ruda-month-header{background:#f9fafb;color:#6b7280;font-size:10px;padding:8px 4px;text-align:center;font-weight:600;position:sticky;top:0;z-index:10;white-space:nowrap}
.ruda-cell{padding:8px 12px;border-bottom:1px solid #f3f4f6;background:transparent;white-space:nowrap}
.ruda-cell.right{text-align:right}
.phases-packages{width:360px;min-width:260px;position:sticky;left:0;z-index:5;background:#fff}
.ruda-table tbody .phases-packages{box-shadow:2px 0 4px rgba(0,0,0,0.08)}
.ruda-phase-header{font-weight:600;padding:14px 16px;font-size:13px;position:sticky;left:0;z-index:5}
.ruda-phase-row:hover,.ruda-package-row:hover,.ruda-subpackage-row:hover{opacity:0.95}
.package-cell{padding-left:24px;font-weight:500;color:#1f2937;position:sticky;left:0;z-index:5;box-shadow:2px 0 4px rgba(0,0,0,0.08)}
.subpackage-cell{padding-left:40px;font-weight:500;color:#374151;position:sticky;left:0;z-index:5;box-shadow:2px 0 4px rgba(0,0,0,0.08)}
.activity-cell{padding-left:56px;color:#4b5563;position:sticky;left:0;z-index:5;box-shadow:2px 0 4px rgba(0,0,0,0.08)}
.ruda-timeline-cell{position:relative;height:42px}
.ruda-bar-wrapper{position:relative;height:42px}
.ruda-bar{position:absolute;height:20px;border-radius:50px;top:50%;transform:translateY(-50%);border:none;box-shadow:0 2px 6px rgba(0,0,0,0.15);transition:all .12s ease;opacity:0.98}
.ruda-bar:hover{transform:translateY(-50%) scale(1.03);box-shadow:0 3px 10px rgba(0,0,0,0.25);opacity:1}
/* Tooltip */
.ruda-tooltip{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%) translateY(6px) scale(.98);padding:12px 14px;background:linear-gradient(180deg,rgba(12,14,20,0.98),rgba(8,10,12,0.96));color:#fff;border-radius:12px;min-width:200px;max-width:420px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.04);box-shadow:0 18px 48px rgba(3,8,23,0.55);opacity:0;pointer-events:none;transition:opacity 180ms ease,transform 220ms cubic-bezier(.2,.85,.25,1);display:flex;gap:12px;align-items:center}
.ruda-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border-width:8px 8px 0 8px;border-style:solid;border-color:rgba(12,14,20,0.98) transparent transparent transparent}
.ruda-bar-wrapper:hover .ruda-tooltip{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}
.ruda-tooltip .ruda-tooltip-icon{width:44px;height:44px;flex:0 0 44px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));box-shadow:inset 0 -6px 18px rgba(0,0,0,0.18)}
.ruda-tooltip .ruda-tooltip-body{display:flex;flex-direction:column}
.ruda-tooltip .ruda-tooltip-title{font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px}
.ruda-tooltip .ruda-tooltip-meta{font-size:12px;color:rgba(255,255,255,0.85);margin-top:2px}
.ruda-wbs-icon{width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;margin-right:4px}
/* Ensure sticky cells inherit row background colors */
.ruda-phase-row td:first-child{background:inherit}
.ruda-package-row td:first-child{background:inherit}
.ruda-subpackage-row td:first-child{background:inherit}
@media (max-width:900px){.phases-packages{min-width:200px}.ruda-table{min-width:1100px}}
/* Print/PDF helpers */
.ruda-table { page-break-inside: auto; }
.ruda-table tr { page-break-inside: avoid; page-break-after: auto; }
.ruda-table thead { display: table-header-group; }
.ruda-table tfoot { display: table-footer-group; }
/* PDF Export specific styles */
@media print, (prefers-color-scheme: pdf) {
  .ruda-table-wrapper{overflow-x:visible!important;overflow-y:visible!important}
  .phases-packages,.ruda-phase-header,.package-cell,.subpackage-cell,.activity-cell{position:relative!important;left:auto!important;box-shadow:none!important}
  .ruda-table thead th{position:relative!important;top:auto!important;white-space:nowrap!important}
  .ruda-month-header{position:relative!important;top:auto!important;white-space:nowrap!important}
  .ruda-tooltip{display:none!important}
  .ruda-cell{white-space:nowrap!important}
  .ruda-table{table-layout:auto!important;width:auto!important}
}
.pdf-export .ruda-table-wrapper{overflow-x:visible!important;overflow-y:visible!important}
.pdf-export .phases-packages,.pdf-export .ruda-phase-header,.pdf-export .package-cell,.pdf-export .subpackage-cell,.pdf-export .activity-cell{position:relative!important;left:auto!important;box-shadow:none!important;background:inherit!important}
.pdf-export .ruda-table thead th{position:relative!important;top:auto!important;white-space:nowrap!important;padding:10px 12px!important;vertical-align:middle!important;text-align:center!important}
.pdf-export .ruda-month-header{position:relative!important;top:auto!important;white-space:nowrap!important;padding:8px 4px!important;vertical-align:middle!important;text-align:center!important}
.pdf-export .ruda-tooltip{display:none!important}
.pdf-export .ruda-cell{white-space:nowrap!important;padding:10px 12px!important;vertical-align:middle!important}
.pdf-export .ruda-cell.right{text-align:right!important}
.pdf-export .ruda-table{table-layout:fixed!important;width:100%!important;border-collapse:collapse!important}
.pdf-export .ruda-phase-header{white-space:normal!important;padding:10px 12px!important;vertical-align:middle!important;text-align:left!important}
.pdf-export .package-cell{white-space:normal!important;padding:10px 12px!important;padding-left:24px!important;vertical-align:middle!important;text-align:left!important}
.pdf-export .subpackage-cell{white-space:normal!important;padding:10px 12px!important;vertical-align:middle!important;text-align:left!important}
.pdf-export .activity-cell{padding:10px 12px!important;vertical-align:middle!important;text-align:left!important}
.pdf-export .ruda-phase-row,.pdf-export .ruda-package-row,.pdf-export .ruda-subpackage-row{height:auto!important}
.pdf-export .ruda-timeline-cell{height:50px!important;vertical-align:middle!important;padding:10px 4px!important}
.pdf-export .ruda-bar-wrapper{height:50px!important;display:flex!important;align-items:center!important}
.pdf-export .ruda-bar{height:20px!important}
/* Keep PDF styling consistent with on-screen layout: restore original paddings/heights */
.pdf-export .ruda-timeline-cell{height:42px!important;padding:8px 12px!important}
.pdf-export .ruda-bar-wrapper{height:42px!important}
.pdf-export .ruda-cell{padding:8px 12px!important}
.pdf-export .ruda-table thead th{padding:12px 16px!important}
.pdf-export .ruda-phase-header{padding:14px 16px!important}
.pdf-export .package-cell{padding-left:24px!important}
.pdf-export .ruda-phase-row,.pdf-export .ruda-package-row,.pdf-export .ruda-subpackage-row{height:auto!important}
.pdf-export .ruda-phase-header,.pdf-export .package-cell,.pdf-export .subpackage-cell,.pdf-export .activity-cell{word-break:keep-all!important;overflow-wrap:normal!important}
.pdf-export .ruda-table thead th,.pdf-export .ruda-table tbody td{box-sizing:border-box!important}
` 
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
  const [downloading, setDownloading] = useState(false);
  const pdfRef = useRef(null);
  
  // 🎨 CUSTOMIZABLE COLOR PALETTE - Match reference image
  // Customize these colors for each level of your schedule hierarchy
  const levelColors = {
    0: { bg: "#d1f5e8", bar: "#4a5568" }, // Project level - light mint / dark gray bar
    1: { bg: "#afedcf", bar: "#1fdd81" }, // Level 1 - green bg / white bar
    2: { bg: "#ffb84d", bar: "#ef9000" }, // Level 2 - orange bg / white bar
    3: { bg: "#5b9aff", bar: "#005aeb" }, // Level 3 - blue bg / white bar
    4: { bg: "#ff6b6b", bar: "#e73737" }, // Level 4 - red bg / white bar
    5: { bg: "#b4e7ff", bar: "#6fcefb" }, // Level 5+ - light blue bg / white bar
  };
  // Tooltip position handlers: keep tooltip inside the timeline cell and add small interactive movement
  const handleTooltipMove = (e) => {
    try {
      const wrapper = e.currentTarget;
      const tooltip = wrapper.querySelector(".ruda-tooltip");
      if (!tooltip) return;
      // Ensure tooltip is visible so we can measure
      tooltip.style.opacity = "1";
      // Measure
      const wrapperRect = wrapper.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const pointerX = e.clientX - wrapperRect.left; // local x
      const desiredLeft = pointerX - tooltipRect.width / 2;
      const min = 6; // padding from edges
      const max = Math.max(6, wrapperRect.width - tooltipRect.width - 6);
      const clamped = Math.min(max, Math.max(min, desiredLeft));
      // Position tooltip in pixels (override centering transform)
      tooltip.style.left = `${clamped}px`;
      tooltip.style.transform = `translateY(0) scale(1)`;
    } catch (err) {
      // swallow — this is best-effort for visual polish
    }
  };

  const handleTooltipEnter = (e) => {
    try {
      const wrapper = e.currentTarget;
      const tooltip = wrapper.querySelector(".ruda-tooltip");
      if (!tooltip) return;
      tooltip.style.opacity = "1";
      // Slight scale up entrance
      tooltip.style.transform = `translateY(0) scale(1)`;
      tooltip.style.transition = `opacity 160ms ease, transform 220ms cubic-bezier(.2,.85,.25,1)`;
    } catch (err) {}
  };

  const handleTooltipLeave = (e) => {
    try {
      const wrapper = e.currentTarget;
      const tooltip = wrapper.querySelector(".ruda-tooltip");
      if (!tooltip) return;
      // Reset to original centered state
      tooltip.style.opacity = "0";
      tooltip.style.left = "50%";
      tooltip.style.transform = `translateX(-50%) translateY(6px) scale(.98)`;
    } catch (err) {}
  };
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
              end_date: " ",
            },
            {
              name: "Completion of Project",
              duration: 0,
              start_date: "",
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
              start_date: "",
              end_date: "10-Oct-25",
            },
            {
              name: "Road Works Drawings IFCs",
              duration: 0,
              start_date: "",
              end_date: "08-Nov-25",
            },
            {
              name: "Finishing Drawings IFCs",
              duration: 0,
              start_date: "",
              end_date: "08-Nov-25",
            },
            {
              name: "Architectural / MEP Drawings IFCs",
              duration: 0,
              start_date: "",
              end_date: "10-Oct-25",
            },
            {
              name: "Ancillary Works IFCs",
              duration: 0,
              start_date: "",
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
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "10-Oct-25",
                              end_date: "16-Oct-25",
                            },
                          ],
                        },
                        {
                          name: "Basement-3",
                          duration: 7,
                          start_date: "17-Oct-25",
                          end_date: "23-Oct-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "17-Oct-25",
                              end_date: "23-Oct-25",
                            },
                          ],
                        },
                        {
                          name: "Basement-2",
                          duration: 7,
                          start_date: "24-Oct-25",
                          end_date: "30-Oct-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "24-Oct-25",
                              end_date: "30-Oct-25",
                            },
                          ],
                        },
                        {
                          name: "Basement-1",
                          duration: 7,
                          start_date: "31-Oct-25",
                          end_date: "06-Nov-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "31-Oct-25",
                              end_date: "06-Nov-25",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Super Structure",
                      duration: 7,
                      start_date: "10-Oct-25",
                      end_date: "16-Oct-25",
                      subtasks: [
                        {
                          name: "Ground Floor",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "10-Oct-25",
                              end_date: "16-Oct-25",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Road Works",
                      duration: 7,
                      start_date: "17-Oct-25",
                      end_date: "23-Oct-25",
                      subtasks: [
                        {
                          name: "Shop Drawings Submission",
                          duration: 7,
                          start_date: "17-Oct-25",
                          end_date: "23-Oct-25",
                        },
                      ],
                    },
                    {
                      name: "Finishing Works",
                      duration: 7,
                      start_date: "24-Oct-25",
                      end_date: "30-Oct-25",
                      subtasks: [
                        {
                          name: "Shop Drawings Submission",
                          duration: 7,
                          start_date: "24-Oct-25",
                          end_date: "30-Oct-25",
                        },
                      ],
                    },
                    {
                      name: "Arcillary Works",
                      duration: 7,
                      start_date: "29-Nov-25",
                      end_date: "05-Dec-25",
                      subtasks: [
                        {
                          name: "Shop Drawings Submission",
                          duration: 7,
                          start_date: "29-Nov-25",
                          end_date: "05-Dec-25",
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Approval",
                  duration: 71,
                  start_date: "10-Oct-25",
                  end_date: "19-Dec-25",
                  subtasks: [
                    {
                      name: "Sub Structure",
                      duration: 35,
                      start_date: "10-Oct-25",
                      end_date: "23-Oct-25",
                      subtasks: [
                        {
                          name: "Shoring & Raft",
                          duration: 14,
                          start_date: "10-Oct-25",
                          end_date: "23-Oct-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "10-Oct-25",
                              end_date: "23-Oct-25",
                            },
                          ],
                        },
                        {
                          name: "Basement-3",
                          duration: 14,
                          start_date: "17-Oct-25",
                          end_date: "30-Oct-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "17-Oct-25",
                              end_date: "30-Oct-25",
                            },
                          ],
                        },
                        {
                          name: "Basement-2",
                          duration: 14,
                          start_date: "24-Oct-25",
                          end_date: "06-Nov-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 7,
                              start_date: "24-Oct-25",
                              end_date: "06-Nov-25",
                            },
                          ],
                        },
                        {
                          name: "Basement-1",
                          duration: 14,
                          start_date: "31-Oct-25",
                          end_date: "13-Nov-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 14,
                              start_date: "31-Oct-25",
                              end_date: "13-Nov-25",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Super Structure",
                      duration: 14,
                      start_date: "17-Oct-25",
                      end_date: "30-Oct-25",
                      subtasks: [
                        {
                          name: "Ground Floor",
                          duration: 14,
                          start_date: "17-Oct-25",
                          end_date: "30-Oct-25",
                          subtasks: [
                            {
                              name: "Shop Drawings Submission",
                              duration: 14,
                              start_date: "17-Oct-25",
                              end_date: "30-Oct-25",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Road Works",
                      duration: 14,
                      start_date: "17-Oct-25",
                      end_date: "30-Oct-25",
                      subtasks: [
                        {
                          name: "Shop Drawings Submission",
                          duration: 14,
                          start_date: "17-Oct-25",
                          end_date: "30-Oct-25",
                        },
                      ],
                    },
                    {
                      name: "Finishing Works",
                      duration: 14,
                      start_date: "24-Oct-25",
                      end_date: "06-Nov-25",
                      subtasks: [
                        {
                          name: "Shop Drawings Submission",
                          duration: 14,
                          start_date: "24-Oct-25",
                          end_date: "06-Nov-25",
                        },
                      ],
                    },
                    {
                      name: "Arcillary Works",
                      duration: 14,
                      start_date: "06-Dec-25",
                      end_date: "19-Dec-25",
                      subtasks: [
                        {
                          name: "Shop Drawings Submission",
                          duration: 14,
                          start_date: "06-Dec-25",
                          end_date: "19-Dec-25",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Procurement",
          duration: 214,
          start_date: "10-Oct-25",
          end_date: "11-May-26",
             subtasks: [
                        {
                          name: "Material Submittals",
                          duration: 51,
                          start_date: "10-Oct-25",
                          end_date: "29-Nov-25",
                             subtasks: [
                        {
                          name: "Aggregate(Crush)",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Bitumen",
                          duration: 7,
                          start_date: "16-Nov-25",
                          end_date: "22-Nov-25",
                        },
                        {
                          name: "Cement",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Counduits (MEP)",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Earthing Material",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Electrical Equipment & Accessories",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "Fire Fighting Equipment & Accessories",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "HVAC Equipment & Accessories",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "Masonary",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Mechanical Equipment & Accessories",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "Parking Management & CCTV System",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "Passenger Elevator",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "Pavers",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Reinforcement",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Sand",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Shuttering",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Sub-Base Material",
                          duration: 7,
                          start_date: "16-Nov-25",
                          end_date: "22-Nov-25",
                        },
                        {
                          name: "Termite Proofing",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Transformer",
                          duration: 7,
                          start_date: "23-Nov-25",
                          end_date: "29-Nov-25",
                        },
                        {
                          name: "Water Proofing",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Water Stooper",
                          duration: 7,
                          start_date: "10-Oct-25",
                          end_date: "16-Oct-25",
                        },
                        {
                          name: "Waterbound Matraial",
                          duration: 7,
                          start_date: "16-Nov-25",
                          end_date: "22-Nov-25",
                        },
                      ]
                        },
                        {
                          name:"Material Approvals",
                          duration:58,
                          start_date:"10-Oct-25",
                          end_date:"06-Dec-25",
                          subtasks:[
                            {
                              name: "Aggregate(Crush)",
                              duration:14,
                              start_date:"10-Oct-25",
                              end_date:"23-Oct-25", 
                            },
                            {
                              name: "Bitumen",
                              duration:14,
                              start_date:"16-Nov-25",
                              end_date:"29-Nov-25", 
                            },
                            {
                              name: "Cement",
                              duration:14,
                              start_date:"10-Oct-25",
                              end_date:"23-Oct-25",
                            },
                            {
                              name: "Counduits (MEP)",
                              duration:14,
                              start_date:"10-Oct-25",
                              end_date:"23-Oct-25",
                            },
                            {
                              name: "Earthing Material",
                              duration:14,
                              start_date:"10-Oct-25",
                              end_date:"23-Oct-25",
                            },
                            {
                              name: "Electrical Equipment & Accessories",
                              duration:14,
                              start_date:"23-Nov-25",
                              end_date:"06-Dec-25",
                            },
 
                            {
                              name: "Water Stooper",
                              duration:14,
                              start_date:"10-Oct-25",
                              end_date:"23-Oct-25",
                            },
                            {
                              name: "Waterbound Matraial",
                              duration:14,
                              start_date:"16-Nov-25",
                              end_date:"29-Nov-25",
                            }
                          ]
                        },
                        {
                          name:"Material (Issuance of PO, Manufacturing & Delivery)",
                          duration:200,
                          start_date:"24-Oct-25",
                          end_date:"11-May-26",
                          subtasks:[
                            {
                              name:"Short Lead Items",
                              duration:200,
                              start_date:"24-Oct-25",
                              end_date:"11-May-26",
                              subtasks:[
                                {
                                  name: "Aggregate(Crush)",
                                  duration:169,
                                  start_date:"24-Oct-25",
                                  end_date:"10-Apr-26",
                                },
                                {
                                  name: "Bitumen",
                                  duration:40,
                                  start_date:"23-Feb-26",
                                  end_date:"03-Apr-26",
                                },
                                {
                                  name: "Cement",
                                  duration:169,
                                  start_date:"24-Oct-25",
                                  end_date:"10-Apr-26",
                                },
                                {
                                  name: "Counduits (MEP)",
                                  duration:180,
                                  start_date:"13-Nov-25",
                                  end_date:"11-May-26",
                                },
                                {
                                  name: "Electrical Earthing Material",
                                  duration:14,
                                  start_date:"24-Oct-25",
                                  end_date:"06-Nov-25",
                                },
                                {
                                  name: "Electrical Equipment & Accessories",
                                  duration:30,
                                  start_data:"15-Feb-25",
                                  end_date:"16-Mar-26",
                                },
                                {
                                  name:"HVAC Equipment & Accessories",
                                  duration:30,
                                  start_date:"15-Feb-26",
                                  end_date:"16-Mar-26",
                                },
                                {
                                  name:"Masonary",
                                  duration:169,
                                  start_date:"24-Oct-25",
                                  end_date:"10-Apr-26",
                                },
                                {
                                  name:"Mechanical Equipment & Accessories",
                                  duration:30,
                                  start_date:"15-Feb-26",
                                  end_date:"16-Mar-26",
                                },
                                {
                                  name:"Pavers",
                                  duration:37,
                                  start_date:"02-Jan-26",
                                  end_date:"07-Feb-26",
                                },
                                {
                                  name:"Reinforcement",
                                  duration:169,
                                  start_date:"24-Oct-25",
                                  end_date:"10-Apr-26",
                                },
                                {
                                  name:"Sand",
                                  duration:169,
                                  start_date:"24-Oct-25",
                                  end_date:"10-Apr-26",
                                },
                                {
                                  name:"Shuttering",
                                  duration:60,
                                  start_date:"24-Oct-25",
                                  end_date:"22-Dec-25",
                                },
                                {
                                  name:"Sub-Base Material",
                                  duration:40,
                                  start_date:"18-Feb-26",
                                  end_date:"29-Mar-26",
                                },
                                {
                                  name:"Termite Proofing",
                                  duration:14,
                                  start_date:"24-Oct-25",
                                  end_date:"06-Nov-25",
                                },
                                {
                                  name:"Water Proofing",
                                  duration:150,
                                  start_date:"24-Oct-25",
                                  end_date:"22-Mar-26",
                                },
                                {
                                  name:"Water Stooper",
                                  duration:25,
                                  start_date:"24-Oct-25",
                                  end_date:"17-Nov-25",
                                },
                                {
                                  name:"Waterbound Matraial",
                                  duration:40,
                                  start_date:"18-Feb-26",
                                  end_date:"29-Mar-26",
                                }
                              ]
                            }
                          ]
                        }
                      ]
        },
        {

        }
      ],
    },
  ];
  const togglePhase = (phaseIndex) => {
    const newSet = new Set(expandedPhases);
    newSet.has(phaseIndex) ? newSet.delete(phaseIndex) : newSet.add(phaseIndex);
    setExpandedPhases(newSet);
  };
  // Progress calculation removed — progress column and UI are disabled per request.
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
  const renderTimeline = (item, level = 0, keyStr = "", isLeaf = false) => {
    // Precise day-based positioning: compute left/width as percent of full project span
    const parseDate = (s) => {
      if (!s || typeof s !== "string") return null;
      const parts = s.trim().split(/[-/\s]+/);
      if (parts.length < 3) return null;
      const day = parseInt(parts[0], 10) || 1;
      const monStr = parts[1];
      const yearPart = parts[2];
      const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const m = months[monStr] ?? months[monStr.slice(0, 3)];
      if (m === undefined) return null;
      let yy = parseInt(yearPart, 10);
      if (yy < 100) yy = 2000 + yy;
      return new Date(yy, m, day);
    };

    const projectStart = parseDate(data?.[0]?.start_date) || null;
    const projectEnd = parseDate(data?.[0]?.end_date) || null;

    const startDate = parseDate(item.start_date);
    const endDate = parseDate(item.end_date);
    if (startDate && endDate && projectStart && projectEnd && projectEnd > projectStart) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const totalDays = Math.max(1, Math.ceil((projectEnd - projectStart) / msPerDay));
      const itemStartOffset = Math.max(0, Math.floor((startDate - projectStart) / msPerDay));
      const itemDurationDays = Math.max(1, Math.ceil((endDate - startDate) / msPerDay));
      const leftPct = (itemStartOffset / totalDays) * 100;
      const widthPct = (itemDurationDays / totalDays) * 100;
      // Bar color: use the 'bar' color from levelColors (e.g., #1fdd81 for green, #ffffff for others)
      const barColor = levelColors[level]?.bar || levelColors[1].bar;
      // tooltip with inline icon and meta
      return (
        <div
          className="ruda-bar-wrapper"
          onMouseMove={handleTooltipMove}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <div className="ruda-tooltip" role="tooltip" aria-hidden="true">
            <div className="ruda-tooltip-icon">
              {/* small WBS icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="12" rx="2" fill={barColor} />
                <path d="M6 11h12" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ruda-tooltip-body">
              <div className="ruda-tooltip-title">{item.name}</div>
              <div className="ruda-tooltip-meta">{item.start_date || "-"} → {item.end_date || "-"} · {item.duration ?? "-"} days</div>
            </div>
          </div>
          {/* Full white background bar from project start to end */}
          <div className="ruda-bar" style={{ left: '0%', width: '100%', background: '#ffffff', minWidth: '100%', opacity: 0.9 }} />
          {/* Actual colored bar for the activity duration */}
          <div className="ruda-bar" style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: barColor, minWidth: '6px' }} />
        </div>
      );
    }

    // Fallback: use timeline bitmap if present
    if (!item.timeline || !Array.isArray(item.timeline)) return null;
    const start = item.timeline.findIndex((v) => v === 1);
    const duration = item.timeline.filter((v) => v === 1).length;
    if (start === -1 || duration === 0) return null;
    // Bar color: use the 'bar' color from levelColors (e.g., #1fdd81 for green, #ffffff for others)
    const barColor = levelColors[level]?.bar || levelColors[1].bar;
    return (
      <div
        className="ruda-bar-wrapper"
        onMouseMove={handleTooltipMove}
        onMouseEnter={handleTooltipEnter}
        onMouseLeave={handleTooltipLeave}
      >
        <div className="ruda-tooltip" role="tooltip" aria-hidden="true">
          <div className="ruda-tooltip-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="12" rx="2" fill={barColor} />
            </svg>
          </div>
          <div className="ruda-tooltip-body">
            <div className="ruda-tooltip-title">{item.name}</div>
            <div className="ruda-tooltip-meta">{item.duration ?? "-"} days</div>
          </div>
        </div>
        {/* Full white background bar */}
        <div className="ruda-bar" style={{ left: '0', width: '100%', background: '#ffffff', opacity: 0.9 }} />
        {/* Actual colored bar for the activity duration */}
        <div className="ruda-bar" style={{ left: `${start * monthWidth}px`, width: `${duration * monthWidth}px`, background: barColor }} />
      </div>
    );
  };
  // Return a color depending on nesting level - uses customizable palette
  const getColorForLevel = (level = 0, key = "") => {
    // Use the customizable color palette defined above
    if (levelColors[level]) return levelColors[level].bg;
    // For deeper levels beyond the palette, use a fallback color
    return levelColors[5]?.bg || "#e5e7eb";
  };
  // Auto-compute text color based on background brightness for optimal contrast
  const getTextForLevel = (level = 0) => {
    const bg = getColorForLevel(level);
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      if (!hex || hex.startsWith("hsl")) return null;
      let h = hex.replace('#','');
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      const num = parseInt(h,16);
      return { r: (num>>16)&255, g: (num>>8)&255, b: num&255 };
    };
    const rgb = hexToRgb(bg);
    if (!rgb) return '#000';
    // Calculate relative luminance
    const srgb = [rgb.r/255, rgb.g/255, rgb.b/255].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
    const lum = 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
    // Return white text for dark backgrounds, black text for light backgrounds
    return lum > 0.5 ? '#000' : '#fff';
  };
  // Render an icon: WBS for non-leaf, Activity for leaf. Color is passed via `fill`.
  const renderIconSVG = (_level = 0, isActivity = false, size = 18, fill = null) => {
    const color = fill || getColorForLevel(0);
    if (isActivity) {
      // Activity (leaf) icon: filled circle with inner dot
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="12" r="9" fill={color} />
          <circle cx="12" cy="12" r="3" fill="#fff" />
        </svg>
      );
    }
    // WBS icon (non-leaf): simple rounded rectangle so all non-leaves share the same icon
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="3" fill={color} />
        <path d="M6 11h12" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  };
  // Small inline indicator (chevron) to show an item has children; rotates when expanded
  const renderChildIndicator = (hasChildren, expanded, color = "currentColor") => {
    if (!hasChildren) return null;
    const transform = expanded ? "rotate(180deg)" : "rotate(0deg)";
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 6, transform, transition: "transform .14s ease", flex: '0 0 12px' }} aria-hidden>
        <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };
  // Show log component if requested
  if (showLog) {
    return <LogManager onBack={() => setShowLog(false)} />;
  }
  // ✅ Define this BEFORE return (same scope)
  const renderSubtasks = (subtasks, parentKey, level = 1, parentDuration = null) => {
    return subtasks.map((st, i) => {
      const key = `${parentKey}-${i}`;
      const backgroundColor = getColorForLevel(level, st.name || key);
      return (
        <React.Fragment key={key}>
          <tr
            className="ruda-subpackage-row"
            onClick={() => toggleSubpackage(key)}
            style={{ backgroundColor: (st.subtasks && st.subtasks.length > 0) ? backgroundColor : '#ffffff' }}
          >
            <td
              className="ruda-cell subpackage-cell"
              style={{ paddingLeft: `${level * 20}px` }}
            >
              {(() => {
                const isActivity = !(st.subtasks && st.subtasks.length > 0);
                // Auto-compute text color based on background brightness
                const rowTextColor = isActivity ? '#000' : getTextForLevel(level);
                const iconFill = isActivity ? '#000' : getTextForLevel(level);
                return (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span className="ruda-wbs-icon">{renderIconSVG(level, isActivity, 14, iconFill)}</span>
                    <span style={{ lineHeight: 1.05, color: rowTextColor }}>{st.name}</span>
                    {renderChildIndicator(st.subtasks && st.subtasks.length > 0, expandedSubpackages.has(key), rowTextColor)}
                  </div>
                );
              })()}
            </td>
            <td className="ruda-cell right">-</td>
            <td className="ruda-cell right">{st.duration}</td>
            <td className="ruda-cell right">{st.start_date}</td>
            <td className="ruda-cell right">{st.end_date}</td>
            <td colSpan={totalMonths} className="ruda-timeline-cell" style={{ backgroundColor: (st.subtasks && st.subtasks.length > 0) ? backgroundColor : '#ffffff' }}>
              {renderTimeline ? renderTimeline(st, level, key, !(st.subtasks && st.subtasks.length > 0)) : null}
            </td>
          </tr>

          {/* 🔁 Recursive nesting */}
          {expandedSubpackages.has(key) && st.subtasks && renderSubtasks(st.subtasks, key, level + 1, st.duration)}
        </React.Fragment>
      );
    });
  };
  // -- compute months range from project start/end (from JSON data) --
  const parseDateStr = (s) => {
    if (!s || typeof s !== "string") return null;
    const parts = s.trim().split(/[-/\s]+/);
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10) || 1;
    const monStr = parts[1];
    const yearPart = parts[2];
    const monthsMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const m = monthsMap[monStr] ?? monthsMap[monStr.slice(0, 3)];
    if (m === undefined) return null;
    let yy = parseInt(yearPart, 10);
    if (yy < 100) yy = 2000 + yy;
    return new Date(yy, m, day);
  };

  const buildMonthsRange = (startStr, endStr) => {
    const s = parseDateStr(startStr);
    const e = parseDateStr(endStr);
    if (!s || !e || s > e) return [];
    const months = [];
    const cur = new Date(s.getFullYear(), s.getMonth(), 1);
    while (cur <= e) {
      const label = cur.toLocaleString(undefined, { month: "short" });
      const yearShort = String(cur.getFullYear()).slice(-2);
      months.push(`${label}-${yearShort}`);
      cur.setMonth(cur.getMonth() + 1);
    }
    return months;
  };

  const months = buildMonthsRange(data?.[0]?.start_date, data?.[0]?.end_date) || [];
  const totalMonths = months.length || 60; // fallback to 60 if none
  const yearGroups = [];
  if (months.length) {
    let curYear = null;
    let span = 0;
    months.forEach((m) => {
      const parts = m.split("-");
      const yr = parts[1];
      if (curYear === null) {
        curYear = yr;
        span = 1;
      } else if (yr === curYear) {
        span++;
      } else {
        yearGroups.push({ year: curYear, span });
        curYear = yr;
        span = 1;
      }
    });
    if (curYear !== null) yearGroups.push({ year: curYear, span });
  }
  return (
    <div className="ruda-container">
      <div className="ruda-header-container">
        <div className="ruda-header-left">
          {/* Add your logo here: <img src="/path/to/logo.png" alt="Logo" className="ruda-header-logo" /> */}
          <h1 className="ruda-title">{data[0].project}</h1>
        </div>
        <button
          onClick={async () => {
            if (!pdfRef.current || downloading) return;
            try {
              setDownloading(true);

              // 1) Backup current expanded states
              const prevPhases = new Set(expandedPhases);
              const prevPackages = new Set(expandedPackages);
              const prevSubpackages = new Set(expandedSubpackages);

              // 2) Expand everything so the PDF includes full WBS with activities
              const allPhases = new Set();
              const allPackages = new Set();
              const allSubpackages = new Set();

              data.forEach((project, pIndex) => {
                allPhases.add(pIndex);
                (project.tasks || []).forEach((task, tIndex) => {
                  const pkgKey = `${pIndex}-${tIndex}`;
                  if (task.subtasks && task.subtasks.length > 0) {
                    allPackages.add(pkgKey);
                  }
                  const traverse = (subs, parentKey) => {
                    (subs || []).forEach((st, i) => {
                      const key = `${parentKey}-${i}`;
                      if (st.subtasks && st.subtasks.length > 0) {
                        allSubpackages.add(key);
                        traverse(st.subtasks, key);
                      }
                    });
                  };
                  traverse(task.subtasks, pkgKey);
                });
              });

              setExpandedPhases(allPhases);
              setExpandedPackages(allPackages);
              setExpandedSubpackages(allSubpackages);

              // Wait for the DOM to render expanded content
              await new Promise((r) => setTimeout(r, 300));

              // Add PDF export class to remove sticky positioning for PDF
              if (pdfRef.current) {
                pdfRef.current.classList.add('pdf-export');
              }

              // Wait a bit for CSS to apply
              await new Promise((r) => setTimeout(r, 200));

              // Force container to its full scroll width so html2canvas captures layout like on-screen
              if (pdfRef.current) {
                try {
                  const scrollW = pdfRef.current.scrollWidth;
                  if (scrollW && scrollW > pdfRef.current.clientWidth) {
                    pdfRef.current.style.width = scrollW + 'px';
                  }
                } catch (e) {
                  // ignore
                }
              }

              const opt = {
                margin: [5, 5, 5, 5],
                filename: "Detailed-Schedule.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { 
                  scale: 2, 
                  useCORS: true,
                  logging: false,
                  letterRendering: true,
                  allowTaint: true,
                  backgroundColor: '#ffffff'
                },
                jsPDF: { unit: "mm", format: "a3", orientation: "landscape" },
                pagebreak: { mode: ["avoid-all", "css", "legacy"] },
              };
              await html2pdf().set(opt).from(pdfRef.current).save();

              // Clean up forced width and remove PDF export class
              if (pdfRef.current) {
                try { pdfRef.current.style.width = ''; } catch (e) {}
                pdfRef.current.classList.remove('pdf-export');
              }

              // 3) Restore previous expanded states
              setExpandedPhases(prevPhases);
              setExpandedPackages(prevPackages);
              setExpandedSubpackages(prevSubpackages);
            } catch (err) {
              console.error("PDF export failed", err);
            } finally {
              setDownloading(false);
            }
          }}
          style={{
            background: "#fff",
            color: "#0f4c81",
            border: "1px solid rgba(15,76,129,0.25)",
            padding: "8px 12px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: downloading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 18px rgba(15,76,129,0.15)",
          }}
          disabled={downloading}
        >
          {downloading ? "Preparing PDF…" : "Download PDF"}
        </button>
      </div>
      <div className="ruda-content">
        <div style={{ position: "relative" }} ref={pdfRef}>
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
          <div className="ruda-table-wrapper">
          <table className="ruda-table">
            <thead>
              <tr>
                <th className="ruda-header phases-packages text-start" rowSpan="2">
                  Activity Name
                </th>
                <th className="ruda-header text-end amount-column" rowSpan="2">
                  Amount
                  <br />
                  <small>(PKR, M)</small>
                </th>
                <th className="ruda-header text-end duration-column" rowSpan="2">
                  Duration
                  <br />
                  <small>(Days)</small>
                </th>
                <th className="ruda-header actual-start-column whitespace-nowrap" rowSpan="2">
                  Start Date
                </th>
                <th className="ruda-header actual-finish-column whitespace-nowrap" rowSpan="2">
                  Finish Date
                </th>
                {/* Progress column removed */}
                
                {yearGroups.length
                  ? yearGroups.map((yg, idx) => (
                      <th key={idx} className="ruda-header whitespace-nowrap" colSpan={yg.span}>
                        {"20" + yg.year}
                      </th>
                    ))
                  : [...Array(5)].map((_, i) => (
                      <th key={i} className="ruda-header whitespace-nowrap" colSpan="12">
                        FY {25 + i}-{26 + i}
                      </th>
                    ))}
              </tr>
              <tr>
                {months.map((month, index) => (
                  <th key={index} className="ruda-month-header whitespace-nowrap">
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
                  className="ruda-phase-row cursor-pointer"
                 >
                    <td className="ruda-phase-header">
                      <button
                        className="ruda-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePhase(pIndex);
                        }}
                        aria-label={expandedPhases.has(pIndex) ? "Collapse phase" : "Expand phase"}
                      >
                        {expandedPhases.has(pIndex) ? (
                          <svg className="ruda-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg className="ruda-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      {(() => {
                        const hasChildren = !!(project.tasks && project.tasks.length > 0);
                        // Auto-compute text color based on background brightness
                        const textColor = getTextForLevel(0);
                        return (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span className="ruda-wbs-icon">{renderIconSVG(0, false, 18, textColor)}</span>
                            <span style={{ lineHeight: 1.1, color: textColor }}>{project.project.split(" ").slice(0, 5).join(" ")}...</span>
                            {renderChildIndicator(hasChildren, expandedPhases.has(pIndex), textColor)}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="ruda-phase-header text-end">-</td>
                    <td className="ruda-phase-header text-end">
                      {project.duration}
                    </td>
                    <td className="ruda-phase-header text-end">
                      {project.start_date}
                    </td>
                    <td className="ruda-phase-header text-end">
                      {project.end_date}
                    </td>
                      <td colSpan={totalMonths} className="ruda-timeline-cell" style={{ backgroundColor: getColorForLevel(0) }}>
                      {renderTimeline ? renderTimeline(project, 0, `${pIndex}`, !(project.tasks && project.tasks.length > 0)) : null}
                    </td>
                  </tr>
                  {/* Render Tasks */}
                  {expandedPhases.has(pIndex) &&
                    project.tasks.map((task, tIndex) => (
                      <React.Fragment key={tIndex}>
                        <tr
                          className="ruda-package-row cursor-pointer "
                          style={{ backgroundColor: (task.subtasks && task.subtasks.length > 0) ? getColorForLevel(1, task.name || `${pIndex}-${tIndex}`) : '#ffffff' }}
                          onClick={() => togglePackage(`${pIndex}-${tIndex}`)}
                        >
                          <td className="ruda-cell package-cell" >
                            <button
                              className="ruda-icon-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePackage(`${pIndex}-${tIndex}`);
                              }}
                              aria-label={expandedPackages.has(`${pIndex}-${tIndex}`) ? "Collapse package" : "Expand package"}
                            >
                              {expandedPackages.has(`${pIndex}-${tIndex}`) ? (
                                <svg className="ruda-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg className="ruda-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                            {(() => {
                              const isActivity = !(task.subtasks && task.subtasks.length > 0);
                              // Auto-compute text color based on background brightness
                              const textColor = isActivity ? '#000' : getTextForLevel(1);
                              const iconFill = isActivity ? '#000' : getTextForLevel(1);
                              return (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                  <span className="ruda-wbs-icon">{renderIconSVG(1, isActivity, 16, iconFill)}</span>
                                  <span style={{ lineHeight: 1.05, color: textColor }}>{task.name}</span>
                                  {renderChildIndicator(task.subtasks && task.subtasks.length > 0, expandedPackages.has(`${pIndex}-${tIndex}`), textColor)}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="ruda-cell right">-</td>
                          <td className="ruda-cell right">{task.duration}</td>
                          <td className="ruda-cell right">{task.start_date}</td>
                          <td className="ruda-cell right">{task.end_date}</td>

                          <td colSpan={totalMonths} className="ruda-timeline-cell" style={{ backgroundColor: (task.subtasks && task.subtasks.length > 0) ? getColorForLevel(1) : '#ffffff' }}>
                            {renderTimeline ? renderTimeline(task, 1, `${pIndex}-${tIndex}`, !(task.subtasks && task.subtasks.length > 0)) : null}
                          </td>
                        </tr>
                        {/* Recursive subtasks */}
                        {expandedPackages.has(`${pIndex}-${tIndex}`) &&
                          task.subtasks &&
                          renderSubtasks(task.subtasks, `${pIndex}-${tIndex}`, 2)}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}

              <tr>
                <td className="ruda-total-cell text-end">Total</td>
                <td className="ruda-total-cell text-end">0</td>
                <td className="ruda-total-cell text-end">-</td>
                <td className="ruda-total-cell text-end">-</td>
                <td className="ruda-total-cell text-end">-</td>
                <td colSpan={totalMonths} className="ruda-total-cell"></td>
              </tr>
            </tbody>
          </table>
          </div>
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