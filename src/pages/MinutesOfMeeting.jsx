import React from "react";
import { FaPrint } from "react-icons/fa";
import MeetingHeader from "../components/minutesofmeeting/MeetingHeader";
import MeetingParticipants from "../components/minutesofmeeting/MeetingParticipants";
import MeetingIssues from "../components/minutesofmeeting/MeetingIssues";

const MinutesOfMeeting = () => {
  // NEW PRINT TO PDF FUNCTION - Most Reliable Method
  const printToPDF = () => {
    // Only print the .print-content section, hide everything else
    const printStyles = document.createElement("style");
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        .print-content, .print-content * {
          visibility: visible !important;
        }
        .print-content {
          position: absolute !important;
          left: 0; top: 0; width: 100vw !important; min-height: 100vh !important;
          background: #fff !important;
          margin: 0 !important; padding: 0 !important;
          box-shadow: none !important;
        }
      }
    `;
    document.head.appendChild(printStyles);
    setTimeout(() => {
      window.print();
      document.head.removeChild(printStyles);
    }, 100);
  };
  return (
    <div className="p-4 w-full">
      {/* Header with download button */}
      <div className="flex justify-between items-center bg-primary rounded-md py-4 px-6 mb-6 shadow-lg print-hide">
        <div className="flex items-center gap-3">
          <h1 className="text-center text-amber-50 font-extrabold text-2xl tracking-wide">
            Minutes of Meeting
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
      <div className="flex flex-col mx-auto bg-white  shadow-md rounded-md">
        <MeetingHeader />
        <MeetingParticipants />
        <h1 className=" p-2 text-xl py-10 border-black ">
          The Following issues were discussed during the meeting:
        </h1>
        <MeetingIssues/>
      </div>
    </div>
  );
};

export default MinutesOfMeeting;
