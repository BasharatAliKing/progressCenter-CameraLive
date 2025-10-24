import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Minus,
  Plus,
  PlayCircle,
} from "lucide-react";
import { Camera, Download, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
const CAMERA_URL = import.meta.env.VITE_CAMERA_URL; // ✅ Correct way in Vite

export default function LiveDashboard() {
  const params=useParams();
  const [cameras, setCameras] = useState([]);
  console.log(cameras);
  const videoRef = useRef(null);
  const [aiActive, setAIActive] = useState(true);
   const [reloadKey, setReloadKey] = useState(0); // Used to force reload HLS
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3)); // Max zoom 3x
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1)); // Min zo
  // Function to load the HLS stream
  const loadStream = () => {
  //  const src = "http://localhost:8888/cam/index.m3u8";
 //   const src = `${API_URL}/camera/${params.id}/live`;
  const src = `${CAMERA_URL}/${params.id}/index.m3u8`;  
  const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {});
    }
  };
      useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch(`${API_URL}/camera`);
        const data = await res.json();
        console.log(data);
        // find the camera whose _id matches the param
        const found = data.cameras.find((cam) => cam._id === params.id);
        setCameras(found);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);
  // Reload stream whenever reloadKey changes
  useEffect(() => {
    loadStream();
  }, [reloadKey]);

  // 🔁 Reload button handler
  const handleReload = () => {
    setReloadKey((prev) => prev + 1); // re-trigger the stream
  };

  // 📸 Download snapshot handler
  const handleSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to image and download
    const image = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = image;
    link.download = `snapshot_${new Date().toISOString()}.jpg`;
    link.click();
  };
  return (
    <div className=" bg-[url('/Sunrise.jpg')]  bg-no-repeat bg-center bg-cover">
       <div className="flex items-center justify-between px-6 py-4 bg-[#121212e2] shadow-sm">
      {/* Left Section */}
      <div>
        {/* Breadcrumb */}
        <div className="text-sm text-white mb-1">
          <Link className="hover:text-gray-100 duration-500 hover:scale-105" to='/dashboard'>Dashboard</Link> /
           <Link to={`/camera/${params.id}`} className="text-white">{" "}{cameras.location}</Link> /
          <span className="font-medium text-white">{" "}{cameras.name}</span>
        </div>
        {/* Title */}
        <h2 className="text-xl font-semibold text-white">
         {cameras.name} - {cameras.location}
        </h2>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Change Camera Button */}
        {/* <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow hover:bg-gray-50 border border-gray-200 transition">
          <Camera size={18} />
          Change Camera
        </button> */}

      {/* Download Image */}
          <button
            onClick={handleSnapshot}
            className="flex items-center cursor-pointer duration-500 hover:scale-105 gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow hover:bg-gray-50 border border-gray-200 transition"
          >
            <Download size={18} />
            Download image
          </button>

       {/* Reload */}
          <button
            onClick={handleReload}
            className="flex cursor-pointer duration-500 hover:scale-105 items-center justify-center w-10 h-10 rounded-xl bg-white text-gray-700 shadow hover:bg-gray-50 border border-gray-200 transition"
          >
            <RefreshCw size={18} />
          </button>
      </div>
    </div>
      <div className="flex min-h-[90vh]  flex-col gap-5 inset-0 bg-[#121212e2]">
        {/* left bar */}
        <div className="absolute z-[9] flex flex-col gap-4 top-40 right-12 items-end">
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
          w-10 h-10 rounded-[10px]  bg-[#861517ba] text-white  cursor-not-allowed hover:scale-105 duration-500"
            >
              <span className="font-semibold">BIM</span>
            </button>
          </div>

          {/* Square Icon Button */}
          <div className="cursor-pointer">
            <button
              className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white  cursor-pointer hover:scale-105 duration-500
        "
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
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white  cursor-pointer hover:scale-105 duration-500"
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
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white  cursor-pointer hover:scale-105 duration-500"
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
          <div className="cursor-pointer">
            <button
              className="flex items-center justify-center font-semibold whitespace-nowrap text-sm 
          w-10 h-10 rounded-[10px] bg-[#861517ba] text-white  cursor-pointer hover:scale-105 duration-500"
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
        {/* Main content */}
        <div className="flex justify-center items-center">
          <div className="relative  overflow-hidden shadow-2xl ">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-[90vh] max-w-full  bg-black object-cover"
            />
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 gap-2">
              <button className="p-2 bg-white/30 hover:bg-white/40 rounded-full">
                <Minus className="w-4 h-4 text-white" />
              </button>
              <div className="px-4 text-white font-medium select-none">
                Zoom
              </div>
              <button className="p-2 bg-white/30 hover:bg-white/40 rounded-full">
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Live badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
              <PlayCircle className="w-4 h-4 text-green-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
