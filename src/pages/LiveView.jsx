import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Minus, Plus, PlayCircle } from "lucide-react";
import { Camera, Download, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const LIVE_HLS_URL = "https://liveprogresscenter.nespakprogresscenter.com";

export default function LiveDashboard() {
  const params = useParams();

  const [cameras, setCameras] = useState({});
  const [aiActive, setAIActive] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState(1);

  const [streamLoading, setStreamLoading] = useState(true);
  const [streamError, setStreamError] = useState("");

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // =========================================================
  // ZOOM
  // =========================================================

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  // =========================================================
  // LOAD HLS STREAM
  // =========================================================

const loadStream = () => {
  const video = videoRef.current;

  if (!video) {
    console.error("❌ Video element not found");
    return;
  }

  // Destroy previous HLS instance
  if (hlsRef.current) {
    console.log("🧹 Destroying previous HLS instance");
    hlsRef.current.destroy();
    hlsRef.current = null;
  }

  // Reset video
  video.pause();
  video.removeAttribute("src");
  video.load();

  setStreamLoading(true);
  setStreamError("");

  // YOUR CONFIRMED WORKING HLS URL
//  const src =
//    "https://liveprogresscenter.nespakprogresscenter.com/697ce53dd7a3f2528ea656fa/index.m3u8?cookieCheck=1";
 const src = `${LIVE_HLS_URL}/${params.id}/index.m3u8`;
  console.log("=================================");
  console.log("🎥 HLS URL:", src);
  console.log("=================================");

  if (Hls.isSupported()) {
    console.log("✅ HLS.js is supported");

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
    });

    hlsRef.current = hls;

    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("📺 HLS media attached");
    });

    hls.on(Hls.Events.MANIFEST_LOADING, () => {
      console.log("📥 Loading HLS manifest...");
    });

    hls.on(Hls.Events.MANIFEST_LOADED, () => {
      console.log("✅ HLS manifest loaded");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("✅ HLS manifest parsed");

      setStreamLoading(false);
      setStreamError("");

      video
        .play()
        .then(() => {
          console.log("▶️ LIVE STREAM PLAYING");
        })
        .catch((error) => {
          console.warn("⚠️ Autoplay issue:", error);

          // Even if autoplay is blocked,
          // stream itself is loaded.
          setStreamLoading(false);
        });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("❌ HLS ERROR:", data);

      if (data.fatal) {
        setStreamLoading(false);

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setStreamError(
            "Network error while loading live stream."
          );

          console.log("🔄 Trying to recover network error...");

          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setStreamError(
            "Media error while playing live stream."
          );

          console.log("🔄 Trying to recover media error...");

          hls.recoverMediaError();
        } else {
          setStreamError(
            "Unable to load live stream."
          );

          hls.destroy();
          hlsRef.current = null;
        }
      }
    });
  } else if (
    video.canPlayType("application/vnd.apple.mpegurl")
  ) {
    console.log("🍎 Native HLS supported");

    video.src = src;

    video.addEventListener(
      "loadedmetadata",
      () => {
        console.log("✅ Native HLS loaded");

        setStreamLoading(false);
        setStreamError("");

        video.play().catch((error) => {
          console.warn(
            "⚠️ Autoplay blocked:",
            error
          );
        });
      },
      { once: true }
    );

    video.addEventListener(
      "error",
      () => {
        console.error(
          "❌ Native HLS error:",
          video.error
        );

        setStreamLoading(false);
        setStreamError(
          "Unable to load live stream."
        );
      },
      { once: true }
    );
  } else {
    console.error("❌ HLS is not supported");

    setStreamLoading(false);
    setStreamError(
      "Your browser does not support HLS."
    );
  }
};

  // =========================================================
  // FETCH CAMERA
  // =========================================================

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        console.log("📡 Fetching camera information...");

        const res = await fetch(`${API_URL}/camera`);

        if (!res.ok) {
          throw new Error(`Camera API failed: ${res.status}`);
        }

        const data = await res.json();

        console.log("📡 Camera API response:", data);

        const found = data?.cameras?.find((cam) => cam._id === params.id);

        if (!found) {
          console.warn("⚠️ Camera not found:", params.id);

          setCameras({});
          return;
        }

        console.log("✅ Camera found:", found);

        setCameras(found);
      } catch (error) {
        console.error("❌ Error fetching cameras:", error);
      }
    };

    if (params.id) {
      fetchCameras();
    }
  }, [params.id]);

  // =========================================================
  // LOAD STREAM
  // =========================================================

  useEffect(() => {
    if (!params.id) return;

    loadStream();

    // Cleanup when component unmounts
    // or camera ID/reload changes
    return () => {
      console.log("🧹 Cleaning up live stream");

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();

        videoRef.current.removeAttribute("src");

        videoRef.current.load();
      }
    };
  }, [params.id, reloadKey]);

  // =========================================================
  // RELOAD STREAM
  // =========================================================

  const handleReload = () => {
    console.log("🔄 Reloading live stream...");

    setStreamLoading(true);
    setStreamError("");

    setReloadKey((prev) => prev + 1);
  };

  // =========================================================
  // SNAPSHOT
  // =========================================================

  const handleSnapshot = () => {
    const video = videoRef.current;

    if (!video) {
      console.error("❌ Video element not found");
      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      console.warn("⚠️ Video is not ready for snapshot");
      return;
    }

    try {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("❌ Canvas context unavailable");
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL("image/jpeg", 0.95);

      const link = document.createElement("a");

      link.href = image;

      link.download = `snapshot_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.jpg`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      console.log("📸 Snapshot downloaded");
    } catch (error) {
      console.error("❌ Snapshot failed:", error);

      alert(
        "Unable to capture snapshot. Please make sure the live video is playing.",
      );
    }
  };

  // =========================================================
  // RETURN UI
  // =========================================================

  return (
    <div className="bg-[url('/Sunrise.jpg')] bg-no-repeat bg-center bg-cover">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between px-6 py-4 bg-[#121212e2] shadow-sm">
        {/* Left Section */}

        <div>
          {/* Breadcrumb */}

          <div className="text-sm text-white mb-1">
            <Link
              className="hover:text-gray-100 duration-500 hover:scale-105"
              to="/dashboard"
            >
              Dashboard
            </Link>

            {" / "}

            <Link to={`/project/${params.id}`} className="text-white">
              {cameras?.location || "Camera"}
            </Link>

            {" / "}

            <span className="font-medium text-white">
              {cameras?.name || "Live View"}
            </span>
          </div>

          {/* Title */}

          <h2 className="text-xl font-semibold text-white">
            {cameras?.name || "Camera"} - {cameras?.location || "Live View"}
          </h2>
        </div>

        {/* =================================================
            RIGHT SECTION
        ================================================== */}

        <div className="flex items-center gap-3">
          {/* Change Camera */}

          {/* 
          <button
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-white
              text-gray-800
              font-medium
              shadow
              hover:bg-gray-50
              border border-gray-200
              transition
            "
          >
            <Camera size={18} />
            Change Camera
          </button>
          */}

          {/* Download Image */}

          <button
            onClick={handleSnapshot}
            className="
              flex items-center
              cursor-pointer
              duration-500
              hover:scale-105
              gap-2
              px-4 py-2
              rounded-xl
              bg-white
              text-gray-800
              font-medium
              shadow
              hover:bg-gray-50
              border border-gray-200
              transition
            "
          >
            <Download size={18} />
            Download image
          </button>

          {/* Reload */}

          <button
            onClick={handleReload}
            className="
              flex
              cursor-pointer
              duration-500
              hover:scale-105
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              bg-white
              text-gray-700
              shadow
              hover:bg-gray-50
              border border-gray-200
              transition
            "
            title="Reload live stream"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex min-h-[90vh] px-5 flex-col gap-5 inset-0 bg-[#121212e2]">
        {/* ===================================================
            RIGHT TOOL BAR
        ==================================================== */}

        <div className="absolute z-[9] flex flex-col gap-4 top-40 right-12 items-end">
          {/* AI Button */}

          <div className="cursor-pointer">
            <Link
              to="/ai-peopleflow"
              className={`
                flex
                items-center
                justify-center
                font-semibold
                whitespace-nowrap
                text-sm
                w-10
                h-10
                rounded-[10px]
                text-white
                ${aiActive ? "bg-[#129b1d]" : "bg-[rgba(26,28,31,0.52)]"}
                cursor-pointer
                hover:scale-105
                duration-500
              `}
            >
              <span className="font-semibold">AI</span>
            </Link>
          </div>

          {/* BIM Button */}

          <div className="cursor-pointer">
            <button
              disabled
              className="
                flex
                items-center
                justify-center
                font-semibold
                whitespace-nowrap
                text-sm
                w-10
                h-10
                rounded-[10px]
                bg-[#861517ba]
                text-white
                cursor-not-allowed
                hover:scale-105
                duration-500
              "
            >
              <span className="font-semibold">BIM</span>
            </button>
          </div>

          {/* Square Icon Button */}

          <div className="cursor-pointer">
            <button
              className="
                flex
                items-center
                justify-center
                font-semibold
                whitespace-nowrap
                text-sm
                w-10
                h-10
                rounded-[10px]
                bg-[#861517ba]
                text-white
                cursor-pointer
                hover:scale-105
                duration-500
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
              className="
                flex
                items-center
                justify-center
                font-semibold
                whitespace-nowrap
                text-sm
                w-10
                h-10
                rounded-[10px]
                bg-[#861517ba]
                text-white
                cursor-pointer
                hover:scale-105
                duration-500
              "
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
              className="
                flex
                items-center
                justify-center
                font-semibold
                whitespace-nowrap
                text-sm
                w-10
                h-10
                rounded-[10px]
                bg-[#861517ba]
                text-white
                cursor-pointer
                hover:scale-105
                duration-500
              "
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
              className="
                flex
                items-center
                justify-center
                font-semibold
                whitespace-nowrap
                text-sm
                w-10
                h-10
                rounded-[10px]
                bg-[#861517ba]
                text-white
                cursor-pointer
                hover:scale-105
                duration-500
              "
            >
              <svg
                width="20"
                height="20"
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

        {/* ===================================================
            MAIN VIDEO
        ==================================================== */}

        <div className="flex justify-center items-center">
          <div className="relative overflow-hidden shadow-2xl">
            {/* Video */}

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              controls
              className="w-full h-[90vh] max-w-full bg-black object-cover"
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.3s ease",
              }}
            />

            {/* =================================================
                LOADING
            ================================================== */}

            {streamLoading && (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/40
                  z-[5]
                "
              >
                <div className="flex flex-col items-center gap-3 text-white">
                  <div
                    className="
                      w-10
                      h-10
                      border-4
                      border-white/30
                      border-t-white
                      rounded-full
                      animate-spin
                    "
                  />

                  <span className="text-sm">Connecting to live stream...</span>
                </div>
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================== */}

            {!streamLoading && streamError && (
              <div
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-black/60
                    z-[5]
                  "
              >
                <div
                  className="
                      flex
                      flex-col
                      items-center
                      gap-3
                      text-white
                      text-center
                      px-5
                    "
                >
                  <div className="text-red-400 text-lg font-semibold">
                    Live Stream Unavailable
                  </div>

                  <p className="text-sm text-gray-200">{streamError}</p>

                  <button
                    onClick={handleReload}
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        bg-white
                        text-gray-800
                        hover:bg-gray-100
                        transition
                      "
                  >
                    <RefreshCw size={16} />
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                ZOOM CONTROLS
            ================================================== */}

            <div
              className="
                absolute
                bottom-4
                left-1/2
                -translate-x-1/2
                flex
                items-center
                bg-white/20
                backdrop-blur-sm
                rounded-full
                px-3
                py-1
                gap-2
                z-[10]
              "
            >
              {/* Zoom Out */}

              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="
                  p-2
                  bg-white/30
                  hover:bg-white/40
                  rounded-full
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                "
              >
                <Minus className="w-4 h-4 text-white" />
              </button>

              {/* Zoom Text */}

              <div className="px-4 text-white font-medium select-none">
                Zoom {zoom.toFixed(1)}x
              </div>

              {/* Zoom In */}

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="
                  p-2
                  bg-white/30
                  hover:bg-white/40
                  rounded-full
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                "
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* =================================================
                LIVE BADGE
            ================================================== */}

            <div
              className="
                absolute
                top-3
                left-3
                flex
                items-center
                gap-2
                bg-black/60
                px-3
                py-1
                rounded-full
                text-white
                text-sm
                z-[10]
              "
            >
              <PlayCircle
                className="
                  w-4
                  h-4
                  text-green-400
                  animate-pulse
                "
              />

              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
