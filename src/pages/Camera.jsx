import { Cctv } from "lucide-react";
import React, { useState } from "react";
import { GiProgression } from "react-icons/gi";
import { GrDocumentPerformance, GrSchedule } from "react-icons/gr";
import LiveProgress from "../components/LiveProgress";
import OverAllProgress from "../components/OverAllProgress";
import DetailedSchedule from "../components/DetailedSchedule";
import DailyProgressReport from "./DailyProgressReport";

const Camera = () => {
  const [view, setView] = useState(0);
  return (
    <div className='flex min-h-[calc(100vh-56px)] py-5 pb-0 flex-col gap-5 bg-[url("/Sunrise.jpg")] bg-no-repeat bg-center bg-fixed bg-cover'>
      <div className="overflow-auto flex gap-5 mt-2 px-5">
        <button
          onClick={(e) => {
            setView(0);
          }}
          className={`flex cursor-pointer ${
            view === 0 ? "text-primary border-b-2 pb-1" : "text-secondary"
          } itemx-center justify-center gap-1 font-medium whitespace-nowrap text-sm md:text-base `}
        >
          <Cctv size="20" /> Live Progress
        </button>
        <button
          onClick={(e) => {
            setView(1);
          }}
          className={`flex cursor-pointer ${
            view === 1 ? "text-primary border-b-2 pb-1" : "text-secondary"
          } itemx-center justify-center gap-1 font-medium whitespace-nowrap text-sm md:text-base `}
        >
          <GiProgression size="20" /> Overall Progress
        </button>
        <button
          onClick={(e) => {
            setView(2);
          }}
          className={`flex cursor-pointer ${
            view === 2 ? "text-primary border-b-2 pb-1" : "text-secondary"
          } itemx-center justify-center gap-1 font-medium whitespace-nowrap text-sm md:text-base `}
        >
          <GrSchedule size="20" /> Detailed Schedule
        </button>
        <button
          onClick={(e) => {
            setView(3);
          }}
          className={`flex cursor-pointer ${
            view === 3 ? "text-primary border-b-2 pb-1" : "text-secondary"
          } itemx-center justify-center gap-1 font-medium whitespace-nowrap text-sm md:text-base `}
        >
          <GrDocumentPerformance size="20" /> Daily Progress Report 
        </button>
      </div>
      <div className="flex w-full">
        {view === 0 ? (
          <LiveProgress />
        ) : view === 1 ? (
          <OverAllProgress />
        ) : view === 2 ? (
          <div className="mx-5 w-full overflow-y-scroll">
            <DetailedSchedule />
          </div>
        ) : (
          <DailyProgressReport />
        )}
      </div>
    </div>
  );
};
export default Camera;
