import { useState, useEffect, useCallback } from "react";
import { Calendar, Play } from "lucide-react";
import { useParams } from "react-router-dom";
import TimelapseCalendar from "../components/timelapse/TimelapseCalendar";
import TimelapseHeader from "../components/timelapse/TimelapseHeader";

const BASE_URL = "https://api.nespakprogresscenter.com";
const API_URL = import.meta.env.VITE_API_URL || BASE_URL;

const parseDdMmmYyyy = (value) => {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const monthName = match[2].toLowerCase();
  const year = Number(match[3]);
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  if (!(monthName in monthMap)) return null;
  const parsed = new Date(year, monthMap[monthName], day);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const formatDateForAPI = (dateInput) => {
  if (!dateInput) return "";
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const normalizeDate = (dateInput) => {
  if (!dateInput) return null;
  const parsedApiDate = parseDdMmmYyyy(dateInput);
  if (parsedApiDate) {
    return new Date(
      parsedApiDate.getFullYear(),
      parsedApiDate.getMonth(),
      parsedApiDate.getDate()
    );
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const collectDatesFromPayload = (payload) => {
  const rawDates = [];

  if (Array.isArray(payload?.dates)) {
    rawDates.push(
      ...payload.dates.map((entry) =>
        typeof entry === "string"
          ? entry
          : entry?.date || entry?.createdAt || entry?.videoDate
      )
    );
  }

  if (Array.isArray(payload?.videos)) {
    rawDates.push(
      ...payload.videos.map(
        (entry) =>
          entry?.video_date || entry?.date || entry?.createdAt || entry?.videoDate
      )
    );
  }

  if (Array.isArray(payload)) {
    rawDates.push(
      ...payload.map((entry) =>
        typeof entry === "string"
          ? entry
          : entry?.video_date || entry?.date || entry?.createdAt || entry?.videoDate
      )
    );
  }

  const unique = new Map();

  rawDates.forEach((dateValue) => {
    const normalized = normalizeDate(dateValue);
    if (!normalized) return;
    unique.set(normalized.toDateString(), normalized);
  });

  return Array.from(unique.values()).sort((a, b) => b.getTime() - a.getTime());
};

function Panel({
  title,
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  isCalendarOpen,
  setIsCalendarOpen,
  availableDates,
  video,
}) {
  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Select Date";

  const currentVideoDate = video?.video_date || selectedDateLabel;

  return (
    <div className="w-full bg-white/95 border border-gray-200 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
          {currentVideoDate}
        </span>
      </div>
      {/* Video */}
      <div className="rounded-xl overflow-hidden bg-[#000] border border-gray-800">
        {video ? (
          <video
            src={`${BASE_URL}${video.videoUrl}`}
            controls
            className="w-full h-[350px] object-cover"
            data-sync="true"
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-white bg-gradient-to-br from-gray-900 to-gray-700">
            No video available for selected date
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="relative flex items-center gap-3 mt-4 bg-gray-50 border border-gray-200 rounded-xl p-2">
        <div className="bg-white p-2 rounded-xl shadow">
          <Calendar size={20} />
        </div>

        <button
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="bg-white px-3 py-2 rounded-xl border border-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-50 min-w-[180px] text-left"
        >
          {selectedDateLabel}
        </button>

        {isCalendarOpen && (
          <TimelapseCalendar
            currentMonth={currentMonth}
            availableDates={availableDates}
            selectedDate={selectedDate || new Date()}
            onDateSelect={(date) => {
              setSelectedDate(normalizeDate(date));
              setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
              setIsCalendarOpen(false);
            }}
            onMonthChange={(offset) => {
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function SideBySideVideo() {
  const params = useParams();
  const [cameras, setCameras] = useState({});
  const [availableDates, setAvailableDates] = useState([]);

  const [leftDate, setLeftDate] = useState(null);
  const [rightDate, setRightDate] = useState(null);

  const [leftCurrentMonth, setLeftCurrentMonth] = useState(new Date());
  const [rightCurrentMonth, setRightCurrentMonth] = useState(new Date());

  const [leftCalendarOpen, setLeftCalendarOpen] = useState(false);
  const [rightCalendarOpen, setRightCalendarOpen] = useState(false);

  const [leftVideo, setLeftVideo] = useState(null);
  const [rightVideo, setRightVideo] = useState(null);

  const fetchVideoByDate = useCallback(async (date, setVideo) => {
    if (!date) {
      setVideo(null);
      return;
    }

    const formatted = formatDateForAPI(date);
    if (!formatted) {
      setVideo(null);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/side-by-side-videos/by-date/${formatted}`);
      const data = await res.json();

      if (Array.isArray(data?.videos) && data.videos.length > 0) {
        setVideo(data.videos[0]);
        return;
      }
      setVideo(null);
    } catch (error) {
      console.error("Error fetching side-by-side video:", error);
      setVideo(null);
    }
  }, []);

  const fetchAvailableDates = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/side-by-side-videos`);
      if (!res.ok) {
        setAvailableDates([]);
        return;
      }

      const data = await res.json();
      const parsedDates = collectDatesFromPayload(data);
      setAvailableDates(parsedDates);
    } catch (error) {
      console.error("Error fetching side-by-side available dates:", error);
      setAvailableDates([]);
    }
  }, []);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch(`${API_URL}/camera`);
        const data = await res.json();
        const found = data?.cameras?.find((cam) => cam._id === params.id);
        setCameras(found || {});
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
    fetchAvailableDates();
  }, [fetchAvailableDates, params.id]);

  useEffect(() => {
    if (!availableDates.length) return;
    const latest = availableDates[0];
    const earliest = availableDates[availableDates.length - 1];

    if (!leftDate) {
      setLeftDate(latest);
      setLeftCurrentMonth(new Date(latest.getFullYear(), latest.getMonth(), 1));
    }

    if (!rightDate) {
      setRightDate(earliest);
      setRightCurrentMonth(new Date(earliest.getFullYear(), earliest.getMonth(), 1));
    }
  }, [availableDates, leftDate, rightDate]);

  // Left date change
  useEffect(() => {
    fetchVideoByDate(leftDate, setLeftVideo);
  }, [leftDate, fetchVideoByDate]);

  // Right date change
  useEffect(() => {
    fetchVideoByDate(rightDate, setRightVideo);
  }, [rightDate, fetchVideoByDate]);

  const handleReload = () => {
    fetchVideoByDate(leftDate, setLeftVideo);
    fetchVideoByDate(rightDate, setRightVideo);
  };

  const handleDownload = () => {
    const targetVideo = leftVideo || rightVideo;
    if (!targetVideo?.videoUrl) return;

    const link = document.createElement("a");
    link.href = `${BASE_URL}${targetVideo.videoUrl}`;
    link.download = targetVideo.videoUrl.split("/").pop() || `side-by-side-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Play both videos together
  const playBoth = () => {
    const videos = document.querySelectorAll("video[data-sync='true']");

    videos.forEach((video) => {
      video.currentTime = 0;
    });

    videos.forEach((video) => {
      video.play();
    });
  };

  return (
    <div className="bg-[url('/Sunrise.jpg')] font-dancing min-h-screen bg-no-repeat bg-center bg-cover">
      <TimelapseHeader
        cameras={cameras}
        params={params}
        onSnapshot={handleDownload}
        onReload={handleReload}
        modeLabel="Side by Side Video"
        snapshotLabel="Download video"
      />

      <div className="relative p-6">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <button
            onClick={playBoth}
            className="bg-white hover:bg-gray-100 cursor-pointer p-5 rounded-full shadow-2xl border border-gray-200 pointer-events-auto"
            title="Play both videos"
          >
            <Play className="text-primary" size={32} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-[#1212125b] rounded-2xl min-h-[calc(100vh-130px)] border border-white/20 shadow-2xl">
          <Panel
            title="Left Video"
            selectedDate={leftDate}
            setSelectedDate={setLeftDate}
            currentMonth={leftCurrentMonth}
            setCurrentMonth={setLeftCurrentMonth}
            isCalendarOpen={leftCalendarOpen}
            setIsCalendarOpen={setLeftCalendarOpen}
            availableDates={availableDates}
            video={leftVideo}
          />
          <Panel
            title="Right Video"
            selectedDate={rightDate}
            setSelectedDate={setRightDate}
            currentMonth={rightCurrentMonth}
            setCurrentMonth={setRightCurrentMonth}
            isCalendarOpen={rightCalendarOpen}
            setIsCalendarOpen={setRightCalendarOpen}
            availableDates={availableDates}
            video={rightVideo}
          />
        </div>
      </div>
    </div>
  );
}