import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TimelapseHeader from "../components/timelapse/TimelapseHeader";
import TimelapseToolbar from "../components/timelapse/TimelapseToolbar";
import TimelapseSidebar from "../components/timelapse/TimelapseSidebar";
import TimelapseViewer from "../components/timelapse/TimelapseViewer";
import TimelapseBottomSheet from "../components/timelapse/TimelapseBottomSheet";
import TimelapseFullscreen from "../components/timelapse/TimelapseFullscreen";
import PrintShotModal from "../components/timelapse/PrintShotModal";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

export default function TimeLapse() {
  const params = useParams();
  const [cameras, setCameras] = useState([]);
  const [imageUrl, setImageUrl] = useState('/Sunrise.jpg');
  const [currentImageTime, setCurrentImageTime] = useState(null);
  const [aiActive, setAIActive] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPrintShotOpen, setIsPrintShotOpen] = useState(false);
  const [printShotZoom, setPrintShotZoom] = useState(1);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const menuRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  
  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsTimeMenuOpen(false);
        setShowCalendar(false);
      }
    };
    
    if (isTimeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimeMenuOpen]);

  // Close calendar when menu closes
  useEffect(() => {
    if (!isTimeMenuOpen) {
      setShowCalendar(false);
    }
  }, [isTimeMenuOpen]);
  
  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === "Escape" && isPrintShotOpen) {
        setIsPrintShotOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, isPrintShotOpen]);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));
  const handleZoomChange = (value) => setZoom(value);

  const handlePrintShotZoomIn = () => setPrintShotZoom((prev) => Math.min(prev + 0.2, 3));
  const handlePrintShotZoomOut = () => setPrintShotZoom((prev) => Math.max(prev - 0.2, 1));
  const handlePrintShotZoomChange = (value) => setPrintShotZoom(value);

  const handleDownloadPrintShot = () => {
    if (!imageUrl) return;
    const fullImageUrl = `${VITE_IMAGE_PATH}${imageUrl}`;
    const link = document.createElement("a");
    link.href = fullImageUrl;
    link.download = `snapshot-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch cameras
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

  // Parse date and time from image filename (format: YYYYMMDDHHMMSS)
  const parseImageDateTime = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Extract filename from path (e.g., "uploads/20260121110939.jpg" -> "20260121110939")
    const filename = imageUrl.split('/').pop().split('.')[0];
    
    // Check if filename matches the date format (14 digits)
    if (filename && filename.match(/^\d{14}$/)) {
      const year = filename.substring(0, 4);
      const month = filename.substring(4, 6);
      const day = filename.substring(6, 8);
      const hour = filename.substring(8, 10);
      const minute = filename.substring(10, 12);
      const second = filename.substring(12, 14);
      
      // Create date object
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
      
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    return null;
  };

  // Fetch latest image function
  const fetchLatestImage = async () => {
    try {
      const res = await fetch(`${API_URL}/snapshots/latest/${params.id}`);
      const data = await res.json();
      if (data?.image?.url) {
        setImageUrl(data.image.url);
        // Parse date from image filename
        const parsedDate = parseImageDateTime(data.image.url);
        setCurrentImageTime(parsedDate || new Date(data.image.createdAt));
        setSelectedSnapshot(data.image);
      }
    } catch (error) {
      console.error("Error fetching latest image:", error);
    }
  };

  // Fetch latest image on mount
  useEffect(() => {
    fetchLatestImage();
    fetchAvailableDates();
    fetchSnapshotsForDate(selectedDate);
  }, []);

  // Fetch snapshots when date changes
  useEffect(() => {
    fetchSnapshotsForDate(selectedDate);
  }, [selectedDate]);

  // Fetch available dates
  const fetchAvailableDates = async () => {
    try {
      const res = await fetch(`${API_URL}/snapshots/camera/${params.id}/dates`);
      const data = await res.json();
      if (data.success && data.dates) {
        setAvailableDates(data.dates.map(d => new Date(d.date)));
      }
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  const formatDateParam = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch snapshots for a specific date
  const fetchSnapshotsForDate = async (date) => {
    try {
      const dateStr = formatDateParam(date);
      const res = await fetch(`${API_URL}/snapshots/camera/${params.id}?date=${dateStr}`);
      console.log(`${API_URL}/snapshots/camera/${params.id}?date=${dateStr}`);
      const data = await res.json();
      // Data is directly an array of snapshots
      if (Array.isArray(data)) {
        setSnapshots(data);
      }
    } catch (error) {
      console.error("Error fetching snapshots:", error);
    }
  };

  // Format time from timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Check if date is available
  const isDateAvailable = (date) => {
    return availableDates.some(availDate => 
      availDate.getDate() === date.getDate() &&
      availDate.getMonth() === date.getMonth() &&
      availDate.getFullYear() === date.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    // Always set the selected date and fetch snapshots for it
    const normalized = new Date(date);
    setSelectedDate(normalized);
    setShowCalendar(false);
    fetchSnapshotsForDate(normalized);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  // Apply selected snapshot
  const handleApplySnapshot = (snapshot = selectedSnapshot) => {
    if (snapshot) {
      setImageUrl(snapshot.url);
      // Parse date from image filename
      const parsedDate = parseImageDateTime(snapshot.url);
      setCurrentImageTime(parsedDate || (snapshot.createdAt ? new Date(snapshot.createdAt) : null));
      setSelectedSnapshot(snapshot);
      setIsTimeMenuOpen(false);
    }
  };

  // Reload/refresh handler
  const handleReload = () => {
    fetchLatestImage();
    fetchSnapshotsForDate(selectedDate);
  };

  // Download snapshot handler
  const handleSnapshot = () => {
    const link = document.createElement("a");
    link.href = `${VITE_IMAGE_PATH}${imageUrl}`;
    link.download = `timelapse_${new Date().toISOString()}.jpg`;
    link.click();
  };

  return (
    <div className="bg-[url('/Sunrise.jpg')] font-dancing w-full bg-no-repeat bg-center bg-cover">
      <TimelapseHeader
        cameras={cameras}
        params={params}
        onSnapshot={handleSnapshot}
        onReload={handleReload}
      />
      <TimelapseToolbar
        isTimeMenuOpen={isTimeMenuOpen}
        selectedDate={selectedDate}
        currentImageTime={currentImageTime}
        formatTime={formatTime}
        formatDate={formatDate}
        onToggleMenu={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
        showToolsMenu={showToolsMenu}
        onToggleToolsMenu={() => setShowToolsMenu(!showToolsMenu)}
      />

      <div className="flex min-h-[80vh] px-5 flex-col gap-5 inset-0 bg-[#121212e2]">
        <TimelapseSidebar 
          aiActive={aiActive} 
          isFullscreen={isFullscreen} 
          onFullscreen={() => setIsFullscreen(true)} 
          onPrintShot={() => setIsPrintShotOpen(true)}
        />
        <TimelapseViewer
          imageUrl={imageUrl}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomChange={handleZoomChange}
          imagePath={VITE_IMAGE_PATH}
        />
      </div>
      <TimelapseBottomSheet
        isOpen={isTimeMenuOpen}
        showCalendar={showCalendar}
        selectedDate={selectedDate}
        currentImageTime={currentImageTime}
        selectedSnapshot={selectedSnapshot}
        snapshots={snapshots}
        currentMonth={currentMonth}
        availableDates={availableDates}
        formatDate={formatDate}
        formatTime={formatTime}
        imagePath={VITE_IMAGE_PATH}
        onClose={() => setIsTimeMenuOpen(false)}
        onToggleCalendar={() => setShowCalendar(!showCalendar)}
        onDateSelect={handleDateSelect}
        onMonthChange={changeMonth}
        onSelectSnapshot={setSelectedSnapshot}
        onApply={handleApplySnapshot}
      />
      <TimelapseFullscreen
        isOpen={isFullscreen}
        imageUrl={imageUrl}
        zoom={zoom}
        onClose={() => setIsFullscreen(false)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomChange={handleZoomChange}
        imagePath={VITE_IMAGE_PATH}
      />

      <PrintShotModal
        isOpen={isPrintShotOpen}
        imageUrl={imageUrl}
        imagePath={VITE_IMAGE_PATH}
        currentImageTime={currentImageTime}
        selectedDate={selectedDate}
        zoom={printShotZoom}
        onClose={() => setIsPrintShotOpen(false)}
        onDownload={handleDownloadPrintShot}
        onZoomIn={handlePrintShotZoomIn}
        onZoomOut={handlePrintShotZoomOut}
        onZoomChange={handlePrintShotZoomChange}
        formatTime={formatTime}
        formatDate={formatDate}
      />
    </div>
  );
}
