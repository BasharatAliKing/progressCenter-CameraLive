import React from "react";
import { Link } from "react-router-dom";

export default function TimelapseSidebar({ aiActive, isFullscreen, onFullscreen, onPrintShot }) {
  return (
    <div className="absolute z-[9] flex flex-col gap-4 top-41 right-12 items-end">
      {/* AI Button */}
      <div className="cursor-pointer">
        <Link to="/ai-peopleflow"
          disabled
          className={`flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] text-white
          ${
            aiActive ? "bg-[#129b1d]" : "bg-[rgba(26,28,31,0.52)]"
          } cursor-pointer hover:scale-105 duration-500`}
        >
          <span className="font-semibold">AI</span>
        </Link>
      </div>

      {/* BIM Button */}
      <div className="cursor-pointer">
        <button
          disabled
          className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white cursor-not-allowed hover:scale-105 duration-500"
        >
          <span className="font-semibold">BIM</span>
        </button>
      </div>

      {/* Square Icon Button */}
      <div className="cursor-pointer" title="Full Screen">
        <button
          onClick={onFullscreen}
          className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white cursor-pointer hover:scale-105 duration-500"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-grayscale-600"
          >
            <path
              d="M5.444 1H2.778A1.778 1.778 0 001 2.778v2.666m16 0V2.778A1.778 1.778 0 0015.222 1h-2.666m0 16h2.666A1.778 1.778 0 0017 15.222v-2.666m-16 0v2.666A1.778 1.778 0 002.778 17h2.666"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Chat Icon Button */}
      <div className="cursor-pointer">
        <button
          className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white cursor-pointer hover:scale-105 duration-500"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 8.556a7.45 7.45 0 01-.8 3.377 7.556 7.556 0 01-6.756 4.178 7.448 7.448 0 01-3.377-.8L1 17l1.689-5.067a7.449 7.449 0 01-.8-3.377A7.556 7.556 0 016.067 1.8 7.449 7.449 0 019.444 1h.445A7.538 7.538 0 0117 8.111v.445z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Upload Icon Button */}
      <div className="cursor-pointer" style={{ maxHeight: "451px" }}>
        <button
          className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white cursor-pointer hover:scale-105 duration-500"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8v5.6c0 .371.158.727.44.99.28.262.662.41 1.06.41h9c.398 0 .78-.148 1.06-.41.282-.263.44-.619.44-.99V8M10 3.8L7 1 4 3.8M7 1v9.1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Monitor Icon Button */}
      <div className="cursor-pointer" title="Print Shot">
        <button
          onClick={onPrintShot}
          className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white cursor-pointer hover:scale-105 duration-500"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.6 7.3V1h10.8v6.3M4.6 15.4H2.8A1.8 1.8 0 011 13.6V9.1a1.8 1.8 0 011.8-1.8h14.4A1.8 1.8 0 0119 9.1v4.5a1.8 1.8 0 01-1.8 1.8h-1.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.4 11.8H4.6V19h10.8v-7.2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
