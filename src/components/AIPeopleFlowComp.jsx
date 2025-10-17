import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 🔹 Custom Tooltip (kept same)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-1 rounded-md shadow-md border border-gray-200 flex flex-col items-center">
        <img src="/card-1.jpg" alt="Activity Icon" className="w-16 h-10 mb-2" />
        <p className="text-xs font-semibold text-gray-800">
          Activity {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const AIPeopleFlowComp = () => {
  const [fromDate, setFromDate] = useState(new Date(2025, 8, 27));
  const [toDate, setToDate] = useState(new Date(2025, 9, 16));
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Refs to capture separately for insertion to PDF
  const captureRootRef = useRef(null); // optional overall wrapper
  const activityChartRef = useRef(null); // wrapper around Activity chart
  const weatherChartRef = useRef(null); // wrapper around Weather chart

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

  // Dummy Data (unchanged)
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

  const tempData = lineData.map((d) => ({
    date: d.date,
    max: 40,
    min: 25,
  }));

  // ---------------------------
  // 🔹 Helper: sanitize OKLCH/OKLAB colors
  // ---------------------------
  const sanitizeColors = (root) => {
    if (!root) return;
    const all = root.querySelectorAll("*");
    all.forEach((el) => {
      try {
        const style = window.getComputedStyle(el);
        ["color", "backgroundColor", "borderColor"].forEach((prop) => {
          const val = style[prop];
          if (val && (val.includes("oklch") || val.includes("oklab"))) {
            // fallback to a near-equivalent neutral color (you can tweak)
            // Prefer keeping backgrounds light and text dark.
            if (prop === "backgroundColor") el.style[prop] = "#ffffff";
            else el.style[prop] = "#111827"; // dark text
          }
        });
      } catch (e) {
        // ignore
      }
    });
  };

  // ---------------------------
  // 🔹 Download PDF (pixel-clone style)
  // ---------------------------
  const handleDownloadPDF = async () => {
    try {
      // refs to capture individual chart areas
      const activityEl = activityChartRef.current;
      const weatherEl = weatherChartRef.current;
      const rootEl = captureRootRef.current || document.body;

      if (!activityEl || !weatherEl) {
        alert("Cannot capture charts — ensure charts are rendered.");
        return;
      }

      // sanitize colors inside the chart elements (fix oklch bug)
      sanitizeColors(activityEl);
      sanitizeColors(weatherEl);

      // small delay to ensure rendering settled
      await new Promise((r) => setTimeout(r, 350));

      // capture each chart separately for best quality and to place into exact slots
      const activityCanvas = await html2canvas(activityEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const activityImg = activityCanvas.toDataURL("image/png");

      const weatherCanvas = await html2canvas(weatherEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const weatherImg = weatherCanvas.toDataURL("image/png");

      // create PDF A4 portrait
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // Layout constants (tweak if you want exact spacing)
      const margin = 12; // left/right margin in mm
      let cursorY = 10; // starting Y

      // 1) Add NESPAK logo centered
      try {
        const logoResp = await fetch("/nespak-logo.png");
        if (logoResp.ok) {
          const blob = await logoResp.blob();
          const logoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          const logoW = 40; // mm
          const logoH = 20; // mm
          const logoX = (pageW - logoW) / 2;
          pdf.addImage(logoBase64, "PNG", logoX, cursorY, logoW, logoH);
        }
      } catch (e) {
        // ignore missing logo
        console.warn("NESPAK logo load failed", e);
      }

      cursorY += 26;

      // 2) Title (exact text from your sample)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("AI Activity from LDA City Underpass Camera 2", pageW / 2, cursorY, {
        align: "center",
      });

      cursorY += 8;

      // 3) Date range
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const dateRangeText = `From ${format(fromDate, "dd MMM yyyy")} to ${format(
        toDate,
        "dd MMM yyyy"
      )}`;
      pdf.text(dateRangeText, pageW / 2, cursorY, { align: "center" });

      cursorY += 10;

      // 4) Divider
      pdf.setDrawColor(220);
      pdf.setLineWidth(0.3);
      pdf.line(margin, cursorY, pageW - margin, cursorY);
      cursorY += 8;

      // 5) Section: Project Timeline (we'll place Activity chart as Project Timeline if you want exact clone)
      // Provide heading
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Project Timeline", margin, cursorY);
      cursorY += 6;

      // Insert activity image scaled to fit width
      const imgW = pageW - margin * 2;
      // use activityCanvas dimensions to compute height ratio
      const activityH_mm = (activityCanvas.height / activityCanvas.width) * imgW;
      pdf.addImage(activityImg, "PNG", margin, cursorY, imgW, activityH_mm);
      cursorY += activityH_mm + 8;

      // Section 2 heading: Activity Graphs (insert the same activity again or activity snapshot)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Activity Graphs", margin, cursorY);
      cursorY += 6;

      // Place activity again (or you can choose to place another capture)
      // We'll place the same activity image scaled a bit smaller to match sample
      const smallImgW = (pageW - margin * 3) / 2; // two-up style if needed
      const smallImgH = (activityCanvas.height / activityCanvas.width) * smallImgW;

      // left small
      pdf.addImage(activityImg, "PNG", margin, cursorY, smallImgW, smallImgH);
      // right small (use weather chart here to show variety)
      pdf.addImage(weatherImg, "PNG", margin + smallImgW + margin / 2, cursorY, smallImgW, smallImgH);
      cursorY += smallImgH + 8;

      // Section 3 heading: Weather Graphs
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Weather Graphs", margin, cursorY);
      cursorY += 6;

      // Insert the weather chart full width
      const weatherH_mm = (weatherCanvas.height / weatherCanvas.width) * imgW;
      pdf.addImage(weatherImg, "PNG", margin, cursorY, imgW, weatherH_mm);
      cursorY += weatherH_mm + 10;

      // Footer divider
      pdf.setDrawColor(220);
      pdf.line(margin, cursorY, pageW - margin, cursorY);
      cursorY += 8;

      // Footer text block (matching your sample)
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.text("Powered by NESPAK", pageW / 2, cursorY, { align: "center" });
      cursorY += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Disclaimer: This feature is powered by AI. Results may contain inaccuracies.", pageW / 2, cursorY, {
        align: "center",
        maxWidth: pageW - margin * 2,
      });
      cursorY += 6;

      pdf.text("Report generated by AbuBakar Shahzad", pageW / 2, cursorY, { align: "center" });
      cursorY += 6;

      pdf.text(format(new Date(), "hh:mm a · dd MMM, yyyy"), pageW / 2, cursorY, { align: "center" });

      // Save
      const fileName = `NESPAK_AI_Report_${format(new Date(), "ddMMyyyy_HHmm")}.pdf`;
      pdf.save(fileName);

      // Inform user
      alert("✅ PDF (NESPAK-style) downloaded. Check your Downloads folder.");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("❌ PDF generation failed. See console for details.");
    }
  };

  // ---------------------------
  // Component render (unchanged look; only refs added)
  // ---------------------------
  return (
    <>
      {/* 🔹 Header and Filters (unchanged) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI People Flow</h2>

        <div className="flex gap-3 items-center">
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
            <span className="text-sm text-gray-700">{format(fromDate, "dd MMM, yyyy")}</span>
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
            className="relative flex items-center gap-2 bg-[#e5e7eb] rounded-md px-3 py-2 shadow-sm cursor-pointer"
            onClick={() => {
              setShowToCalendar(!showToCalendar);
              setShowFromCalendar(false);
            }}
          >
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">{format(toDate, "dd MMM, yyyy")}</span>
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

          {/* 📥 Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="bg-primary hover:bg-[#861517dd] cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* 🔹 On-screen content (unchanged) */}
      <div ref={captureRootRef}>
        <div className="grid gap-8">
          {/* Chart 1: AI People Flow - wrap with activityChartRef for capture */}
          <div ref={activityChartRef} className="bg-[#e5e7eb] rounded-2xl shadow p-5">
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
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-center -mt-10 text-sm md:text-base font-medium text-gray-600">● Total Activity</div>
          </div>

          {/* Chart 2: Temperature Overview - wrap with weatherChartRef */}
          <div ref={weatherChartRef} className="bg-[#e5e7eb] rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">🌡️ Temperature Overview</div>
              <select className="border border-gray-200 rounded-lg text-sm px-3 py-1.5 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Pressure</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={tempData} margin={{ top: 20, right: 30, bottom: 60, left: 0 }}>
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

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" interval={0} tick={{ angle: 310, textAnchor: "end", fontSize: 12, fill: "#4b5563" }} height={80} tickMargin={10} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "10px", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", padding: "10px 12px" }} labelStyle={{ color: "#111827", fontWeight: "600" }} formatter={(value, name) => [`${value}°C`, name === "max" ? "Max Temp" : "Min Temp"]} />
                <Line type="monotone" dataKey="max" stroke="url(#maxTempGradient)" strokeWidth={3} dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "white" }} activeDot={{ r: 7 }} isAnimationActive />
                <Line type="monotone" dataKey="min" stroke="url(#minTempGradient)" strokeWidth={3} dot={{ r: 5, fill: "#2563eb", strokeWidth: 2, stroke: "white" }} activeDot={{ r: 7 }} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex justify-center -mt-10 gap-8 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Max Temp</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Min Temp</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIPeopleFlowComp;
