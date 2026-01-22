import { Eye, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH; // Correct Image Path
const CameraCard = ({ camera, funcimg }) => {
  const params = useParams();
  const [latestImage, setLatestImage] = useState(camera.image);
  const [latestImageData, setLatestImageData] = useState(null);
  const [parsedDateTime, setParsedDateTime] = useState(null);

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

  // Fetch latest snapshot for this camera
  useEffect(() => {
    const fetchLatestSnapshot = async () => {
      try {
        const res = await fetch(`${API_URL}/snapshots/latest/${camera._id}`);
        const data = await res.json();
        if (data?.image?.url) {
          setLatestImage(data.image.url);
          setLatestImageData(data.image);
          // Parse date from filename
          const parsedDate = parseImageDateTime(data.image.url);
          setParsedDateTime(parsedDate);
        }
      } catch (error) {
        console.error(
          `Error fetching latest snapshot for camera ${camera._id}:`,
          error,
        );
        // Keep using the default camera.image if fetch fails
      }
    };

    fetchLatestSnapshot();
  }, [camera._id]);

  return (
    <div className="bg-[#e7e4dc] p-4 rounded-md flex flex-col gap-3">
      <div className="img relative">
        {/* Live badge */}
        <Link
          to={`/live-view/${camera._id}`}
          title="Live View"
          className="absolute cursor-pointer top-2 left-3 flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white text-sm"
        >
          <PlayCircle className="w-4 h-4 text-gray-100 animate-pulse" />
          <span className="text-[14px] font-medium text-gray-100">Live</span>
        </Link>
        <Eye
          title="View"
          onClick={(e) => {
            funcimg({
              show: true,
              camera: camera,
              image: latestImage,
              imageData: latestImageData,
            });
          }}
          size="20"
          className="cursor-pointer bg-white absolute top-3 right-2 p-1 rounded-sm"
        />
        <Link to={`/camera/${camera._id}`}>
          <img
            src={`${IMAGE_PATH}${latestImage}`}
            alt="my-img"
            className="rounded-md h-26 cursor-pointer"
          />
        </Link>
      </div>
      <Link to={`/camera/${camera._id}`} className="flex flex-col gap-2">
        <h1 className="flex items-center gap-1 font-semibold text-base">
          <span className="h-2 w-2 mt-[2px] flex rounded-full bg-green-500"></span>
          {camera.name}
        </h1>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h3 className="text-[12px] text-secondary">Last uploaded</h3>
            <p className="text-[10px]">
              {parsedDateTime ? (
                <>
                  {parsedDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} · {parsedDateTime.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </>
              ) : (
                new Date(camera.updatedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              )}
            </p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-[12px] text-secondary">Installed on</h3>
            <p className="text-[10px]">
              {new Date(camera.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CameraCard;
