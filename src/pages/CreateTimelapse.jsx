import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Play, MoreVertical, Eye, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

export default function CreateTimelapse() {
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("create");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("1 Day");
  const [perDay, setPerDay] = useState(2);
  const [timeFilter, setTimeFilter] = useState("24h");
  const [quality, setQuality] = useState("720p");
  const [frameDuration, setFrameDuration] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [availableDays, setAvailableDays] = useState(null);
  const [isRangeLoading, setIsRangeLoading] = useState(false);
  const [cameraData, setCameraData] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [timelapses, setTimelapses] = useState([]);
  const [timelapsesLoading, setTimelapsesLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const durationOptions = [
    { label: "1 Day", range: "1day", days: 1 },
    { label: "5 Days", range: "5days", days: 5 },
    { label: "15 Days", range: "15days", days: 15 },
    { label: "1 Month", range: "30days", days: 30 },
    { label: "3 Months", range: "3months", days: 90 },
    { label: "6 Months", range: "6months", days: 180 },
    { label: "1 Year", range: "1year", days: 365 },
    { label: "2 Years", range: "2years", days: 365 * 2 },
    { label: "3 Years", range: "3years", days: 365 * 3 },
  ];
  const getRangeForDuration = (label) => {
    const found = durationOptions.find((opt) => opt.label === label);
    return found ? found.range : "1day";
  };
  const isOptionEnabled = (opt) => {
    if (availableDays === null) return true;
    return opt.days <= availableDays;
  };
  useEffect(() => {
    const fetchAvailableRange = async () => {
      try {
        setIsRangeLoading(true);
        const res = await fetch(
          `${API_URL}/snapshots/camera/${params.id}/dates`,
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data?.dates) && data.dates.length > 0) {
          const parsedDates = data.dates
            .map((d) => new Date(d.date || d))
            .filter((d) => !Number.isNaN(d));
          if (parsedDates.length) {
            const earliest = parsedDates.reduce(
              (min, d) => (d < min ? d : min),
              parsedDates[0],
            );
            const today = new Date();
            const diffDays = Math.max(
              1,
              Math.floor((today - earliest) / (1000 * 60 * 60 * 24)) + 1,
            );
            setAvailableDays(diffDays);
          }
        }
      } catch (err) {
        console.error("Error fetching available dates", err);
      } finally {
        setIsRangeLoading(false);
      }
    };

    fetchAvailableRange();
  }, [params.id]);
  useEffect(() => {
    const fetchCamera = async () => {
      try {
        const res = await fetch(`${API_URL}/camera/${params.id}`);
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
  }, []);
  // Fetch timelapses for this camera
  useEffect(() => {
    const fetchTimelapses = async () => {
      try {
        setTimelapsesLoading(true);
        // Replace with actual user ID from your auth system
        const userId = "12345"; // TODO: Get from auth context
        const res = await fetch(
          `${API_URL}/snapshots/videos/user/${userId}?cameraId=${params.id}`,
        );
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.videos)) {
          setTimelapses(data.videos);
        }
      } catch (err) {
        console.error("Error fetching timelapses", err);
      } finally {
        setTimelapsesLoading(false);
      }
    };

    if (params.id) {
      fetchTimelapses();
    }
  }, [params.id]);
  useEffect(() => {
    if (availableDays === null) return;
    const currentOpt = durationOptions.find(
      (opt) => opt.label === selectedDuration,
    );
    if (currentOpt && isOptionEnabled(currentOpt)) return;
    const firstEnabled = durationOptions.find((opt) => isOptionEnabled(opt));
    if (firstEnabled) setSelectedDuration(firstEnabled.label);
  }, [availableDays, selectedDuration]);

  // Handle Delete Timelapse
  const handleDeleteTimelapse = async (videoId) => {
    if (!confirm("Are you sure you want to delete this timelapse?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/snapshots/videos/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Timelapse deleted successfully!");
        // Refresh timelapses list
        const userId = "12345";
        const res = await fetch(
          `${API_URL}/snapshots/videos/user/${userId}?cameraId=${params.id}`,
        );
        const videosData = await res.json();
        if (res.ok && videosData.success && Array.isArray(videosData.videos)) {
          setTimelapses(videosData.videos);
        }
      } else {
        alert("Failed to delete timelapse. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting timelapse:", err);
      alert("An error occurred. Please try again.");
    }
    setOpenDropdown(null);
  };

  // Handle Create LiveLapse
  const handleCreateLiveLapse = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const requestBody = {
        range: getRangeForDuration(selectedDuration),
        perDay,
        timeFilter,
        username: "admin",
        userId: "12345",
        frameDuration,
        quality,
      };
      const apiUrl = `${API_URL}/snapshots/${params.id}/timelapse/video`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        setShowCreateModal(false);
        alert(data.message || "LiveLapse creation started! You will be notified when it's ready.");
        // Refresh timelapses list
        const userId = "12345";
        const res = await fetch(
          `${API_URL}/snapshots/videos/user/${userId}?cameraId=${params.id}`,
        );
        const videosData = await res.json();
        if (res.ok && videosData.success && Array.isArray(videosData.videos)) {
          setTimelapses(videosData.videos);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };
  // Sample data - replace with actual API calls
 console.log(timelapses);
  return (
    <div className="min-h-screen bg-[url('/Sunrise.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className=" mx-auto px-6 py-4">
          {/* Back Button and Title */}
          <div className="flex flex-col  justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer text-gray-600 hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {cameraLoading
                    ? "Loading..."
                    : `${cameraData?.name || "Camera"} - ${
                        cameraData?.location ||
                        cameraData?.area?.name ||
                        "Location"
                      }`}
                  <span className="font-normal text-[12px]"> LiveLapse</span>
                </h1>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary cursor-pointer text-sm text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create LiveLapse
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("create")}
              className={`pb-3 px-1 font-medium text-sm cursor-pointer transition-colors relative ${
                activeTab === "create"
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create & View
              {activeTab === "create" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`pb-3 px-1 font-medium text-sm cursor-pointer transition-colors relative ${
                activeTab === "compare"
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Compare
              {activeTab === "compare" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "create" && (
          <>
            {timelapsesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Loading timelapses...
                  </p>
                </div>
              </div>
            ) : timelapses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  No timelapses yet. Click "Create LiveLapse" to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {timelapses.map((timelapse) => (
                  <div
                    key={timelapse._id || timelapse.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
                    onClick={() => {
                      sessionStorage.setItem("timelapsData", JSON.stringify(timelapse));
                      navigate(`/timelapse/${params.id}/video/${timelapse._id }`);
                    }}
                  >
                    <div className="relative">
                      <div className="relative aspect-video bg-gray-200">
                        
                          <video
                            src={`${VITE_IMAGE_PATH}${timelapse.url}`}
                            alt="Timelapse thumbnail"
                            className="w-full h-full object-cover"
                          />
                       
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
                            <Play size={24} className="text-gray-800 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                          {timelapse.status || "Completed"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === timelapse._id ? null : timelapse._id);
                          }}
                          className="w-8 h-8 cursor-pointer bg-white/90 hover:bg-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                        
                        {openDropdown === timelapse._id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                                sessionStorage.setItem("timelapsData", JSON.stringify(timelapse));
                                navigate(`/timelapse/${params.id}/video/${timelapse._id }`);
                              }}
                              className="w-full px-4 cursor-pointer font-medium py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Play size={16} />
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTimelapse(timelapse._id);
                              }}
                              className="w-full px-4 py-2 cursor-pointer font-medium text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <X size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                    
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Time period</p>
                          <p className="text-sm text-gray-900 font-medium leading-tight">
                            {timelapse.range
                              ? (() => {
                                  const today = new Date();
                                  const rangeText = timelapse.range;
                                  let daysAgo = 0;
                                  
                                  if (rangeText.includes("day")) {
                                    daysAgo = parseInt(rangeText.match(/\d+/)?.[0]) || 1;
                                  } else if (rangeText.includes("month")) {
                                    daysAgo = parseInt(rangeText.match(/\d+/)?.[0]) * 30 || 30;
                                  } else if (rangeText.includes("year")) {
                                    daysAgo = parseInt(rangeText.match(/\d+/)?.[0]) * 365 || 365;
                                  }
                                  const startDate = new Date(today);
                                  startDate.setDate(startDate.getDate() - daysAgo);
                                  
                                  const formatDate = (date) => {
                                    const options = { day: 'numeric', month: 'short', year: 'numeric' };
                                    return date.toLocaleDateString('en-US', options);
                                  };
                                  
                                  return `${formatDate(startDate)} to ${formatDate(today)}`;
                                })()
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="text-sm text-gray-900 font-medium">
                            {timelapse.range || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Requested on</p>
                        <p className="text-sm text-black font-medium">
                          {timelapse.createdAt
                            ? (() => {
                                const date = new Date(timelapse.createdAt);
                                const time = date.toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit', 
                                  hour12: true 
                                }).toLowerCase();
                                const dateStr = date.toLocaleDateString('en-US', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                });
                                return `${time} · ${dateStr}`;
                              })()
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-2">Created by</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-semibold">
                                {(timelapse.username || "U").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm capitalize text-gray-900 font-medium">
                              {timelapse.username || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Eye size={16} />
                            <span className="text-sm">{timelapse.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {activeTab === "compare" && (
          <div className="text-center py-16">
            <p className="text-gray-500">Compare view content goes here</p>
          </div>
        )}
        <div />

        {/* Create LiveLapse Modal */}
        {showCreateModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setShowCreateModal(false)}
            ></div>

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
              {/* Header */}
              <div className="bg-primary px-6 py-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Create LiveLapse
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/80 hover:text-white cursor-pointer transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {/* Duration Selection */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📅 Select Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-4 py-2 border-2 text-sm border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-primary transition-all bg-white cursor-pointer hover:border-gray-300"
                  >
                    {durationOptions.map((opt) => (
                      <option
                        key={opt.label}
                        className="cursor-pointer text-sm font-medium"
                        value={opt.label}
                        disabled={!isOptionEnabled(opt)}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {isRangeLoading && "Checking available history..."}
                    {!isRangeLoading &&
                      availableDays !== null &&
                      `You have ${availableDays} day(s) of history available`}
                    {!isRangeLoading &&
                      availableDays === null &&
                      "Choose the time range for your timelapse"}
                  </p>
                </div>
                {/* Images Per Day */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🖼️ Images Per Day
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={perDay}
                      onChange={(e) => setPerDay(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      frames
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[1, 2, 4, 8, 12, 24, 36, 48].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPerDay(num)}
                        className={`flex-1 py-2 rounded-lg text-xs cursor-pointer font-medium transition-all ${
                          perDay === num
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Number of snapshots to include per day
                  </p>
                </div>

                {/* Time Filter */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ⏰ Time Filter
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTimeFilter("24h")}
                      className={`py-3 px-3 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                        timeFilter === "24h"
                          ? "bg-primary text-white shadow-md ring-2 ring-primary-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-bold">24h</div>
                      <div className="text-xs opacity-90 mt-1">Full Day</div>
                    </button>
                    <button
                      onClick={() => setTimeFilter("8-5")}
                      className={`py-3 px-3 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                        timeFilter === "8-5"
                          ? "bg-primary text-white shadow-md ring-2 ring-primary-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-bold">8-5</div>
                      <div className="text-xs opacity-90 mt-1">Work Hours</div>
                    </button>
                    <button
                      onClick={() => setTimeFilter("6-6")}
                      className={`py-3 px-3 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                        timeFilter === "6-6"
                          ? "bg-primary text-white shadow-md ring-2 ring-primary-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-bold">6-6</div>
                      <div className="text-xs opacity-90 mt-1">Daylight</div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {timeFilter === "24h" &&
                      "Capture images throughout the entire day"}
                    {timeFilter === "8-5" && "Capture images from 8 AM to 5 PM"}
                    {timeFilter === "6-6" && "Capture images from 6 AM to 6 PM"}
                  </p>
                </div>

                {/* Video Quality */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📹 Video Quality
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setQuality("720p")}>
                      <input
                        type="radio"
                        name="quality"
                        value="720p"
                        checked={quality === "720p"}
                        onChange={() => setQuality("720p")}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label className="flex-1 cursor-pointer">
                        <div className="text-sm font-medium text-gray-900">720p HD</div>
                        <div className="text-xs text-gray-500">Standard quality, smaller file size</div>
                      </label>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setQuality("1080p")}>
                      <input
                        type="radio"
                        name="quality"
                        value="1080p"
                        checked={quality === "1080p"}
                        onChange={() => setQuality("1080p")}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label className="flex-1 cursor-pointer">
                        <div className="text-sm font-medium text-gray-900">1080p Full HD</div>
                        <div className="text-xs text-gray-500">Premium quality, larger file size</div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Frame Duration */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ⏱️ Frame Duration (seconds)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={frameDuration}
                      onChange={(e) => setFrameDuration(parseFloat(e.target.value) || 1)}
                      className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      sec
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[0.1,0.5,1,2,0.05].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFrameDuration(num)}
                        className={`flex-1 py-2 rounded-lg text-xs cursor-pointer font-medium transition-all ${
                          frameDuration === num
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {num}s
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Duration between each frame (lower = faster playback)
                  </p>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Processing Time
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your timelapse will be processed and ready in a few
                        minutes. You'll be notified when it's complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 cursor-pointer text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLiveLapse}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-primary hover:from-blue-700 cursor-pointer text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Create
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
