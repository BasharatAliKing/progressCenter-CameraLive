import { ChevronLeft, Download, Share2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

const TimeLapseView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const videoRef = useRef(null);

  // State
  const [cameraData, setCameraData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch Camera Data
  useEffect(() => {
    const fetchCamera = async () => {
      try {
        setCameraLoading(true);
        const res = await fetch(`${API_URL}/camera/${params.cameraId}`);
        const data = await res.json();
        if (res.ok && data?.camera) {
          setCameraData(data.camera);
        }
      } catch (err) {
        console.error("Error fetching camera data", err);
      } finally {
        setCameraLoading(false);
      }
    };
    fetchCamera();
  }, [params.cameraId]);
  
  // Fetch Video Data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true);
        const videoId = params.videoId;
        
        if (!videoId) {
          console.error("No video ID found");
          return;
        }
        const res = await fetch(`${API_URL}/snapshots/videos/${params.videoId}`);
        const data = await res.json();
        setVideoData(data?.video);
        
      } catch (err) {
        console.error("Error fetching video data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideoData();
  }, [params.videoId]);
  // Handle Download
  const handleDownload = async () => {
    if (!videoData?.url) {
      alert("Video URL not available");
      return;
    }
    try {
      setIsDownloading(true);
      const videoUrl = `${VITE_IMAGE_PATH}${videoData.url}`;
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `timelapse-${videoData._id || Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      alert("Video downloaded successfully!");
    } catch (err) {
      console.error("Error downloading video:", err);
      alert("Failed to download video. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading || cameraLoading) {
    return (
      <div className="min-h-screen bg-[url('/Sunrise.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full mb-4"></div>
          <p className="text-gray-600 font-medium">Loading video...</p>
        </div>
      </div>
    );
  }
  return (
    <div className=" bg-[url('/Sunrise.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 pt-5">
          <div className="flex flex-row justify-between">
            {/* Left: Back Button and Title */}
            <div className="flex flex-col ">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center cursor-pointer text-gray-600 hover:text-primary transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {cameraData?.name || "Camera"} - {cameraData?.location || cameraData?.area?.name || "Location"}
                <span className="font-normal text-base ml-2">LiveLapse</span>
              </h1>
            </div>
            {/* Right: Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-primary border my-auto border-primary cursor-pointer text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <Download size={18} />
              {isDownloading ? "Downloading..." : "Download"}
            </button>

          </div>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="w-full  bg-[#000000d4]">
        <div className="relative w-full h-full mx-auto max-w-[70%] flex items-center justify-center">
          {videoData?.url ? (
            <>
              <video
                ref={videoRef}
                src={`${VITE_IMAGE_PATH}${videoData.url}`}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload"
              />
              
              {/* Top Right Overlay - Creator Info */}
              <div className="absolute top-6 right-6 bg-gray-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                By {videoData?.username || "Unknown"} | {videoData?.createdAt ? new Date(videoData.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + " - " + new Date(videoData.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
              </div>

              {/* Right Side Share Button */}
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-3 rounded-xl shadow-lg cursor-pointer transition-colors"
                title="Share"
              >
                <Share2 size={20} className="text-gray-700" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <p>Video not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimeLapseView
