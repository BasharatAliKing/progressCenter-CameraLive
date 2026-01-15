import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Minus,
  Plus,
  PlayCircle,
  X,
} from "lucide-react";
import { Camera, Download, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
const CAMERA_URL = import.meta.env.VITE_CAMERA_URL; // ✅ Correct way in Vite
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH; 
export default function TimeLapse() {
  const params=useParams();
  const [cameras, setCameras] = useState([]);
  const [imageUrl, setImageUrl] = useState('/Sunrise.jpg');
  console.log(imageUrl);
  const videoRef = useRef(null);
  const [aiActive, setAIActive] = useState(true);
   const [reloadKey, setReloadKey] = useState(0); // Used to force reload HLS
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);
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
       // find the camera whose _id matches the param
        const found = data.cameras.find((cam) => cam._id === params.id);
        setCameras(found);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  // Fetch latest image
  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        const res = await fetch(`${API_URL}/snapshots/latest/${params.id}`);
        const data = await res.json();
        setImageUrl(data?.image?.url);
        // if (data.success && data.image && data.image.url) {
        // }
      } catch (error) {
        console.error("Error fetching latest image:", error);
      }
    };
    fetchLatestImage();
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
    link.download = `timelapse_${new Date().toISOString()}.jpg`;
    link.click();
  };
  console.log(`${VITE_IMAGE_PATH}/${imageUrl}`);
  return (
    <div className=" bg-[url('/Sunrise.jpg')] font-dancing w-full bg-no-repeat bg-center bg-cover">
       <div className="flex items-center text-black bg-white/10 backdrop-blur-sm border-b border-white/20 justify-between px-6 py-4 shadow-sm">
      {/* Left Section */}
      <div>
        {/* Breadcrumb */}
        <div className="text-sm mb-1 text-[#667085]">
          <Link className="text-[#667085] duration-500 hover:scale-105" to='/dashboard'>Dashboard</Link> /
           <Link to={`/project/${params.id}`} className="text-[#667085]">{" "}{cameras.location}</Link> /
          <span className="font-medium text-[#101828]">{" "}{cameras.name} - TimeLapse</span>
        </div>
        {/* Title */}
        <h2 className="text-xl text-[#101828] font-bold">
         {cameras.name} - {cameras.location}
        </h2>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Change Camera Button */}
        <button className="flex items-center text-sm font-medium cursor-pointer gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 shadow hover:bg-gray-50 border border-gray-200 transition">
          <Camera size={18} />
          Change Camera
        </button>

      {/* Download Image */}
          <button
            onClick={handleSnapshot}
            className="flex items-center text-sm font-medium cursor-pointer duration-500 hover:scale-105 gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 shadow hover:bg-gray-50 border border-gray-200 transition"
          >
            <Download size={18} />
            Download image
          </button>

       {/* Reload */}
          <button
          title="Refresh"
            onClick={handleReload}
            className="flex cursor-pointer  duration-500 hover:scale-105 items-center justify-center w-10 h-10 rounded-xl bg-white text-gray-700 shadow hover:bg-gray-50 border border-gray-200 transition"
          >
            <RefreshCw className="hover:animate-spin" size={18} />
          </button>
      </div>
    </div>
     {/* Top Sub Header Bar */}
       <div className="flex z-10 items-center text-sm font-medium absolute w-[90%] justify-between px-6 py-3 ">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow hover:bg-gray-50 border border-gray-200 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
            Tools and Add-ons
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-800 font-medium shadow border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span id="time">1:30 pm</span> · <span id="date">15 Jan, 2026</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 mr-5">
          <div className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[#121212b9] text-white font-medium">
            <span className="text-sm">11 C</span> · <span>Smoke</span> · <span>smoke</span>
          </div>
          </div>
      </div>
      <div className="flex min-h-[70vh] px-5 flex-col gap-5 inset-0 bg-[#121212e2]">
        {/* left bar */}
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
          w-10 h-10 rounded-[10px]  bg-[#861517ba] text-white  cursor-not-allowed hover:scale-105 duration-500"
            >
              <span className="font-semibold">BIM</span>
            </button>
          </div>

          {/* Square Icon Button */}
          <div className="cursor-pointer" title="Full Screen">
            <button
              onClick={() => setIsFullscreen(true)}
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
        <div className="flex flex-col justify-center items-center gap-4 px-4">
          <div className="relative overflow-hidden shadow-2xl w-full max-w-4xl">
            <img
              src={`${VITE_IMAGE_PATH}${imageUrl}`}
             style={{ transform: `scale(${zoom})` }}
              className="w-full h-full bg-black object-cover transition-transform duration-200"
            />
          </div>

          {/* Zoom controls below video */}
          <div className="flex absolute z-10 -bottom-10 items-center gap-8 rounded-full px-8 py-4 mb-4">
            <button
              onClick={handleZoomOut}
              className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-md bg-white/80 hover:bg-white/40 transition-all duration-200"
            >
              <Minus className="w-5 h-5 text-black" />
            </button>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-48 h-2 bg-white/80 rounded-full appearance-none cursor-pointer accent-white"
                style={{
                  background: `${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) ${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <span className="text-white font-medium min-w-fit select-none">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <button
              onClick={handleZoomIn}
              className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-md bg-white/80 hover:bg-white/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center w-screen h-screen">
          {/* Back Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 left-6 z-51 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
            title="Back (or press ESC)"
          >
            <X className="w-6 h-6 text-white cursor-pointer" />
          </button>

          {/* Fullscreen Video */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
            src={imageUrl}
             style={{ transform: `scale(${zoom})` }}
              className="w-full h-full bg-black object-contain transition-transform duration-200"
            />

            {/* Zoom controls in fullscreen */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-white/20 backdrop-blur-sm rounded-full px-8 py-4">
              <button
                onClick={handleZoomOut}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-48 h-2 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                  style={{
                    background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) ${((zoom - 1) / 2) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <span className="text-white font-medium min-w-fit select-none">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              <button
                onClick={handleZoomIn}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
