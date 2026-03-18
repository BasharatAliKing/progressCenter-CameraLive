import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPrint } from "react-icons/fa"; // Add this import
import ProjectHeader from "../components/dailyprogressreport/ProjectHeader";
import TimeDataClaims from "../components/dailyprogressreport/TimeDataClaims";
import ComData from "../components/dailyprogressreport/ComData";
import Baseline from "../components/dailyprogressreport/Baseline";
import CashGraph from "../components/dailyprogressreport/CashGraph";
import ProgressSCurve from "../components/dailyprogressreport/ProgressCurve";
import ProjectProgressTable from "../components/dailyprogressreport/ProjectProgress";
import EngineeringQualityKPIs from "../components/dailyprogressreport/QualityKPI";
import TopIssuesTable from "../components/dailyprogressreport/TopIssues";
import ManpowerHistogram from "../components/dailyprogressreport/ManPower";
import RisksTable from "../components/dailyprogressreport/Risks";
import WeeklyProgressTasks from "../components/dailyprogressreport/WeeklyProgress";
import OverallProgress from "../components/dailyprogressreport/OverallProgress";
import Photos from "../components/dailyprogressreport/Photos";
const API_URL = import.meta.env.VITE_API_URL;
function DailyProgressReport() {
  const { id } = useParams();
  const dashboardRef = useRef();
  const [report, setReport] = useState(null);
  // NEW PRINT TO PDF FUNCTION - Most Reliable Method
  const printToPDF = () => {
    const header = document.querySelector(".print-hide");
    if (header) header.style.display = "none";
    const printStyles = document.createElement("style");
    printStyles.innerHTML = `
      @media print {
        body { margin: 0; padding: 0; background: #f8fafc; }
        .print-hide { display: none !important; }
        .print-content {
          width: 100%;
          max-width: none;
          padding: 0;
          margin: 0;
          background: #f8fafc;
        }
        .space-y-4 > * {
          page-break-inside: avoid;
          margin-bottom: 24px;
        }
        table {
          page-break-inside: auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        h1, h2, h3 {
          color: #1e293b;
        }
        .rounded-md, .rounded-lg, .rounded-2x2 {
          border-radius: 8px !important;
        }
        .shadow-md, .shadow-lg {
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        }
        .bg-blue-800, .bg-blue-950, .bg-blue-300, .bg-blue-200 {
          background: #1e293b !important;
          color: #fff !important;
        }
        .bg-green-200 {
          background: #22c55e !important;
          color: #fff !important;
        }
        .bg-amber-50 {
          background: #fef3c7 !important;
        }
        .bg-amber-100 {
          background: #fde68a !important;
        }
        .font-bold, .font-extrabold {
          color: #1e293b !important;
        }
        .border {
          border-color: #cbd5e1 !important;
        }
      }
    `;
    document.head.appendChild(printStyles);
    setTimeout(() => {
      window.print();
      if (header) header.style.display = "";
      document.head.removeChild(printStyles);
    }, 100);
  };
  const fetchReport = async () => {
    try {
      const res = await fetch(`${API_URL}/dailyprogress/${id}`);
      const data = await res.json();
        setReport(data.data[0]);
     
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };
  useEffect(() => {
    fetchReport();
  }, []);
  if (!report) {
    return (
      <div className="p-4 text-center text-lg font-bold">Loading report...</div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 via-amber-50 to-green-50 min-h-screen">
      {/* Header with download button */}
      <div className="flex justify-between items-center bg-primary rounded-md py-4 px-6 mb-6 shadow-lg print-hide">
        <div className="flex items-center gap-3">
          <h1 className="text-center text-amber-50 font-extrabold text-2xl tracking-wide">
            Daily Progress Report
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={printToPDF}
            className="p-2 bg-[#40090a] cursor-pointer text-white rounded-full  shadow-md transition-all duration-200"
            title="Print to PDF"
          >
            <FaPrint size={24} />
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div ref={dashboardRef} className="print-content bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <ProjectHeader
            employer={report.employer}
            contractor={report.contractor}
            consultant={report.consultant}
            project={report.project_name}
            plotNo={report.project_id}
            reportNo={report.report_no}
            monthNo={report.month}
            weekNo={report.week_no}
            totalDays={parseInt(report.duration)}
          />
        </div>

        <div className=" grid grid-cols-2 gap-4">
           <TimeDataClaims
              commencementDate={report.commencement_date}
              duration={report.duration}
              completion={report.completion_date}
              forecastCompletion={report.forcast_completion_date}
              eot={report.eot_granted}
              anticipatedEot={report.anticipated_eot}
            />
            <ComData
              contractValue={report.contract_value}
              certifiedToDate={report.certified_to_date}
              cumulativePercentage={report.cumullative_percentage_certified}
              confirmedVariations={report.confirmed_variations}
              revisedContractValue={report.revised_control_value}
              costOfChanges={report.cost_of_changes}
            />
        </div>

        <div className="space-y-4">
          <div className="py-4 rounded-lg ">
            <Baseline
              data={report.baseline && report.baseline.map(b => ({
                programId: b.recovery_programe_comparison,
                submissionDate: b.submission_date,
                approvalDate: b.Approval_date,
                plannedPercent: b.planned,
                actualPercent: b.actual,
                daysAheadDelay: b.days_ahead_delay,
                isHighlight: true,
              }))}
            />
          </div>
          <div className="py-2 rounded-2x2">
            <CashGraph />
          </div>
          <ProgressSCurve
            data={report.progressSCurve && report.progressSCurve.map(s => ({
              month: s.month,
              planned: parseFloat(s.planned),
              actual: parseFloat(s.actual),
            }))}
          />
          <ProjectProgressTable
            overallProgress={{
              planned: parseFloat(report.overall_schedule_performance_percentage),
              actual: parseFloat(report.overall_actual_performance_percentage),
              difference: parseFloat(report.overall_actual_performance_percentage) - parseFloat(report.overall_schedule_performance_percentage),
            }}
            workBreakdownStructure={report.overallProgress && report.overallProgress.map(w => ({
              name: w.progress_name,
              planned: parseFloat(w.progress_planned_thisWeek),
              actual: parseFloat(w.progress_actual_thisWeek),
              difference: parseFloat(w.progress_actual_thisWeek) - parseFloat(w.progress_planned_thisWeek),
            }))}
          />
          <EngineeringQualityKPIs
            data={report.engineeringQuantity}
          />
          <div>
            <OverallProgress
              programId={report.project_id}
              currentPeriodData={report.progressSCurve && report.progressSCurve.map(s => ({
                month: s.month,
                planned: parseFloat(s.planned),
                actual: parseFloat(s.actual),
              }))}
            />
          </div>
          <TopIssuesTable
            issues={report.topIssues && report.topIssues.map(i => ({
              issue: i.issue,
              originator: i.originator,
              category: i.category,
              recommendedAction: i.recommended_action,
              actionBy: i.actionBy,
            }))}
            emptyRows={5}
          />
          <div>
            <ManpowerHistogram
              data={report.manPowerHistogram}
            />
          </div>
          <div>
            <RisksTable
              risks={report.mainRisks && report.mainRisks.map(r => ({
                description: r.risk_description,
                category: r.risk_category,
                impact: r.risk_impact,
                mitigation: r.risk_response,
              }))}
            />
            <Photos
              photos={report.progressPhotos}
            />
            <div>
              <WeeklyProgressTasks
                weeks={report.weeklyProgress || []}
                emptyRowsPerSection={5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyProgressReport;
