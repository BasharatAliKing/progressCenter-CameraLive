import React, { useState } from "react";
import CameraCard from "./CameraCard";
import { RxReload } from "react-icons/rx";
import { CgClose } from "react-icons/cg";
import { Link } from "react-router-dom";
import { MapPin, SquarePen } from "lucide-react";
const projects = [
  {
    id: 1,
    title: "Neela Gumbad",
    city: "Lahore",
    image: "/card-1.jpg", // replace with your image
    members: ["A", "J", "H", "S"],
    lastUpdate: "6:00 pm · 07 Oct, 2025",
    safetyScore: "—",
    construction: "12 days",
  },
];
const LiveProgress = () => {
  const [showImg, setShowImg] = useState(false);
  const funcimg = (val) => {
    setShowImg(val);
  };
  return (
    <div className="flex flex-col gap-5">
      {showImg ? (
        <div className="flex flex-col bg-[#00000068] absolute w-full h-screen items-center justify-center top-0 left-0 z-10">
          <h1 className="bg-white w-1/2 rounded-t-md flex items-center justify-between font-medium p-2">
            Camera 1 · 2:30 pm · 08 Oct, 2025{" "}
            <span
              className="cursor-pointer text-sm"
              onClick={(e) => {
                setShowImg(false);
              }}
            >
              <CgClose size="20" className="hover:bg-gray-200 p-1 rounded-full" />
            </span>
          </h1>
          <img className="flex w-1/2" src="/card-1.jpg" alt="" />
        </div>
      ) : null}
    <div className="flex gap-5">
        <div className="flex flex-col gap-3 w-[250px] bg-white min-h-full p-5">
           <div className="flex flex-col gap-1">
             <h2 className="text-xs font-medium"><Link to="/dashboard" className="cursor-pointer text-secondary hover:text-primary">Dashboard</Link> / <Link className="cursor-pointer hover:text-primary">Neela Gumbad</Link></h2>
            <h1 className="text-xl font-semibold">Neela Gumbad</h1>
            <p className="flex items-center font-medium text-sm text-secondary gap-1"><MapPin size="14"/> Lahore</p>
           </div>
           <img src="/card-1.jpg" className="rounded-md" alt="" />
            {/* Members */}
             <div className="flex items-center justify-between">
                 <div className="flex flex-col justify-between ">
                <p className="text-sm text-gray-500">
                  Members
                </p>
                <div className="flex -space-x-2">
                  {projects[0].members.map((m, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white"
                      style={{
                        backgroundColor:
                          ["#f59e0b", "#6366f1", "#10b981", "#9333ea"][idx % 4],
                        color: "white",
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              </div>
              <SquarePen size="22" className="bg-white cursor-pointer shadow-md p-1 text-secondary rounded-md" />
             </div>
             <div className="flex flex-col">
               <h1 className="text-sm text-gray-500">
                  TimeLine
                </h1>
                <p>-</p>
             </div>
             <div className="flex flex-col">
               <h1 className="text-sm text-gray-500">
                  Overall Progress
                </h1>
               
             </div>
             <div className="flex flex-col">
               <h1 className="text-sm text-gray-500">
                  Project Report
                </h1>
             </div>
             <div className="flex flex-col">
               <h1 className="text-sm text-gray-500">
                  Milestones
                </h1>
               
             </div>
        </div>
          <div className="flex-1 flex-col gap-5 pr-5">
        <div className="flex mb-5 items-center w-full justify-between bg-[#ffffff77] p-2 rounded-md">
        <h1 className="text-base flex items-center gap-1 font-medium text-secondary">
          TimeLapse
          <span className="bg-primary text-white rounded-full p-2 h-5 w-5 text-xs flex items-center justify-center">
            2
          </span>
        </h1>
        <RxReload
          size="22"
          className="cursor-pointer bg-white text-primary p-1 rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <CameraCard funcimg={funcimg} />
      </div>
      </div>
    </div>
    </div>
  );
};

export default LiveProgress;
