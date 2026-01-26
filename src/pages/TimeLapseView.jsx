import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Download, Share2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

export default function TimeLapseView() {
  const navigate = useNavigate();
  const params = useParams();
  const videoRef = useRef(null);
  
  const [timelapsData, setTimelapsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cameraData, setCameraData] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(true);

  // Fetch camera details
  useEffect(() => {
    const fetchCameraData = async () => {
      try {
        setCameraLoading(true);
        const res = await fetch(`${API_URL}/camera/${params.cameraId}`);
        const data = await res.json();
        if (res.ok && data.camera) {
          setCameraData(data.camera);
        }
      } catch (err) {
        console.error("Error fetching camera data:", err);
      } finally {
        setCameraLoading(false);
      }
    };

    if (params.cameraId) fetchCameraData();
  }, [params.cameraId]);

  // Fetch timelapse data
  useEffect(() => {
    const fetchTimelapsData = async () => {
      try {
        setIsLoading(true);
        const storedData = sessionStorage.getItem("timelapsData");
        if (storedData) {
          setTimelapsData(JSON.parse(storedData));
          sessionStorage.removeItem("timelapsData");
        }
      } catch (error) {
        console.error("Error fetching timelapse data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.cameraId) fetchTimelapsData();
  }, [params.cameraId]);

  // Get all frames from days array
  const getAllFrames = () => {
    if (!timelapsData?.days) return [];
    const frames = [];
    timelapsData.days.forEach((day) => {
      if (day.frames && Array.isArray(day.frames)) {
        frames.push(...day.frames);
      }
    });
    return frames;
  };

  const allFrames = getAllFrames();
  const frameDuration = 0.5; // 500ms per frame
  const totalDuration = allFrames.length * frameDuration;

  // Play animation
  useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();

    const animate = () => {
      if (isPlaying) {
        const now = Date.now();
        const elapsed = (now - lastTime) / 1000;
        lastTime = now;

        setCurrentTime((prev) => {
          const newTime = prev + elapsed;
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          const frameIndex = Math.floor(newTime / frameDuration);
          setCurrentFrameIndex(Math.min(frameIndex, allFrames.length - 1));
          return newTime;
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, totalDuration, allFrames.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * totalDuration;
    const frameIndex = Math.floor(newTime / frameDuration);
    setCurrentFrameIndex(Math.min(frameIndex, allFrames.length - 1));
    setCurrentTime(newTime);
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (allFrames[currentFrameIndex]) {
      const frameUrl = `${VITE_IMAGE_PATH}${allFrames[currentFrameIndex].url}`;
      const link = document.createElement("a");
      link.href = frameUrl;
      link.download = `timelapse-frame-${currentFrameIndex}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentFrame = allFrames[currentFrameIndex];
  const cameraLocation = cameraData?.location?.name || cameraData?.area?.name || "Camera";
  const cameraName = cameraData?.name || "Unknown";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Loading timelapse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/Sunrise.jpg')] bg-no-repeat bg-cover flex flex-col">
      {/* Header */}
      <div className=" px-6 py-2 pt-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-primary transition-colors cursor-pointer text-sm font-medium"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {cameraLoading ? "Loading..." : `${cameraLocation} - ${cameraName}`} {" "}
            <span className="font-normal">LiveLapse</span>
          </h1>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 bg-primary rounded-lg transition-colors cursor-pointer font-medium text-white"
          >
            <Download size={20} />
            Download
          </button>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="flex-1 flex items-center justify-center px-10 bg-[#000000d4]">
        <div className="w-full max-w-[80%]">
          {/* Video Display */}
          <div className="relative w-full bg-black overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-400 to-gray-600">
              {currentFrame ? (
                <img
                  src={`${VITE_IMAGE_PATH}${currentFrame.url}`}
                  alt="timelapse frame"
                  className="w-full h-full object-cover"
                  style={{ transform: `scale(${zoom})` }}
                />
              ) : (
                <div className="text-white text-center">
                  <p className="text-lg">No frames available</p>
                </div>
              )}

              {/* Play Button Overlay */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute w-24 h-24 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
                >
                  <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              )}

              {/* Metadata Overlay - Top Right */}
              {currentFrame && (
                <div className="absolute top-6 right-6 bg-gray-800/80 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                  <div>By AbuBakar Shahzad | {new Date(currentFrame.createdAt).toLocaleString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true,
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</div>
                </div>
              )}

              {/* Share Button - Bottom Right */}
              <button className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <Share2 size={20} className="text-gray-700" />
              </button>
            </div>

            {/* Video Controls - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 space-y-3">
              {/* Timeline */}
              <div className="w-full flex items-center gap-2 relative">
                <div
                  onClick={handleTimelineClick}
                  className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer hover:h-1.5 transition-all relative group"
                >
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all relative"
                    style={{ width: `${(currentTime / totalDuration) * 100 || 0}%` }}
                  >
                    {/* Scrubber Circle */}
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  {/* Play Button */}
                  <button
                    onClick={handlePlayPause}
                    className="hover:text-blue-400 transition-colors cursor-pointer p-1.5"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    )}
                  </button>

                  {/* Time Display */}
                  <div className="text-xs font-mono font-medium min-w-20">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Volume */}
                  <button className="hover:text-blue-400 transition-colors cursor-pointer p-1.5" title="Volume">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                    </svg>
                  </button>

                  {/* Settings */}
                  <button className="hover:text-blue-400 transition-colors cursor-pointer p-1.5" title="Settings">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Fullscreen */}
                  <button className="hover:text-blue-400 transition-colors cursor-pointer p-1.5" title="Fullscreen">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4z" />
                      <path d="M15 12a1 1 0 100 2h1.586l-2.293 2.293a1 1 0 101.414 1.414L16 15.586V17a1 1 0 102 0v-4a1 1 0 00-1-1h-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
