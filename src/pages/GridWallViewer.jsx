import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { authHeader } from "../utilities/auth";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

const GridWallViewer = () => {
  const { id } = useParams();
  const [gridInfo, setGridInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [cameraMap, setCameraMap] = useState({});
  const [snapshotMap, setSnapshotMap] = useState({});

  const fetchGrid = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/gridwall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch gridwall data");
      }

      const result = await response.json();
      const selected = result?.data?.find((item) => item._id === id);
      setGridInfo(selected || null);
    } catch (err) {
      console.error("Error fetching gridwall data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrid();
    const intervalId = setInterval(fetchGrid, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    if (gridInfo?.status) {
      setIsActive(gridInfo.status.toLowerCase() === "active");
    }
  }, [gridInfo]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchCamerasForGrid = async () => {
      try {
        const response = await fetch(`${API_URL}/camera`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cameras for grid");
        }

        const result = await response.json();
        const rawCameras =
          result?.cameras ||
          result?.data ||
          (Array.isArray(result) ? result : []);

        if (!isMounted) return;

        const map = rawCameras.reduce((acc, camera) => {
          const cameraId = camera._id || camera.id;
          if (cameraId) {
            acc[cameraId] = camera;
          }
          return acc;
        }, {});

        setCameraMap(map);
      } catch (err) {
        console.error("Error fetching cameras for grid:", err);
      }
    };

    fetchCamerasForGrid();
    intervalId = setInterval(fetchCamerasForGrid, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!gridInfo?.cameraIds?.length) {
      setSnapshotMap({});
      return undefined;
    }

    let isMounted = true;
    let intervalId;

    const fetchLatestSnapshots = async () => {
      try {
        const cameraIds = gridInfo.cameraIds.filter(Boolean);
        const results = await Promise.all(
          cameraIds.map(async (cameraId) => {
            try {
              const response = await fetch(
                `${API_URL}/snapshots/latest/${cameraId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    ...authHeader(),
                  },
                }
              );
              if (!response.ok) return null;
              const data = await response.json();
              return data?.image ? { cameraId, image: data.image } : null;
            } catch (error) {
              console.error(
                `Error fetching latest snapshot for camera ${cameraId}:`,
                error
              );
              return null;
            }
          })
        );

        if (!isMounted) return;

        const map = results.reduce((acc, item) => {
          if (item?.cameraId && item?.image) {
            acc[item.cameraId] = item.image;
          }
          return acc;
        }, {});

        setSnapshotMap(map);
      } catch (error) {
        console.error("Error fetching latest snapshots:", error);
      }
    };

    fetchLatestSnapshots();
    intervalId = setInterval(fetchLatestSnapshots, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [gridInfo]);

  const getSlotCount = (layoutValue) => {
    const layoutNum = Number(layoutValue);
    if (layoutNum === 1) return 2;
    if (layoutNum === 2) return 4;
    if (layoutNum === 3) return 9;
    if (layoutNum === 4) return 16;
    return 4;
  };

  const getGridDimensions = (layoutValue) => {
    const layoutNum = Number(layoutValue);
    if (layoutNum === 1) return { rows: 2, cols: 1 };
    if (layoutNum === 2) return { rows: 2, cols: 2 };
    if (layoutNum === 3) return { rows: 3, cols: 3 };
    if (layoutNum === 4) return { rows: 4, cols: 4 };
    return { rows: 2, cols: 2 };
  };

  const items = useMemo(() => {
    if (!gridInfo) return [];
    const slotCount = getSlotCount(gridInfo.layout);
    const cameraIds = Array.isArray(gridInfo.cameraIds)
      ? gridInfo.cameraIds
      : [];

    const formatDateTime = (value) => {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const day = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return `${time} · ${day}`;
    };

    const parseSnapshotDate = (snapshot) => {
      if (!snapshot) return null;
      const source = snapshot.filename || snapshot.url || "";
      const filename = source.split("/").pop()?.split(".")[0];
      if (!filename || !/^\d{14}$/.test(filename)) return null;
      const year = filename.slice(0, 4);
      const month = filename.slice(4, 6);
      const day = filename.slice(6, 8);
      const hour = filename.slice(8, 10);
      const minute = filename.slice(10, 12);
      const second = filename.slice(12, 14);
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    return Array.from({ length: slotCount }, (_, index) => ({
      id: index + 1,
      image: cameraIds[index]
        ? snapshotMap[cameraIds[index]]?.url
          ? `${IMAGE_PATH || ""}${snapshotMap[cameraIds[index]]?.url}`
          : cameraMap[cameraIds[index]]?.image
          ? `${IMAGE_PATH || ""}${cameraMap[cameraIds[index]]?.image}`
          : "/card-1.jpg"
        : null,
      project: gridInfo.showProjectName
        ? cameraMap[cameraIds[index]]?.projectName ||
          cameraMap[cameraIds[index]]?.project?.name ||
          cameraMap[cameraIds[index]]?.location ||
          "Project..."
        : null,
      camera: gridInfo.showCameraName
        ? cameraMap[cameraIds[index]]?.name ||
          cameraMap[cameraIds[index]]?.location ||
          "Camera..."
        : null,
      time: gridInfo.showDateTime
        ? formatDateTime(
            parseSnapshotDate(snapshotMap[cameraIds[index]]) ||
              cameraMap[cameraIds[index]]?.updatedAt
          ) || "—"
        : null,
    }));
  }, [gridInfo, cameraMap, snapshotMap]);

  const gridDimensions = useMemo(() => {
    if (!gridInfo) return { rows: 2, cols: 2 };
    return getGridDimensions(gridInfo.layout);
  }, [gridInfo]);

  return (
    <div className="bg-[url('/Sunrise.jpg')] bg-no-repeat bg-center bg-cover min-h-screen">
      <div className="flex items-center justify-between px-6 py-4 bg-[#121212e2] shadow-sm">
        <div>
          <div className="text-sm text-white mb-1">
            <Link
              className="hover:text-gray-100 duration-500 hover:scale-105"
              to="/dashboard"
            >
              Dashboard
            </Link>
            {" / "}
            <span className="font-medium text-white">
              {gridInfo?.name || "GridWall Viewer"}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            {gridInfo?.name || "GridWall Viewer"}
          </h2>
        </div>
        <div className="text-sm text-white/80">
          Status: {isActive ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-white">
            Loading grid data...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12 text-red-300">
            Error: {error}
          </div>
        ) : !gridInfo ? (
          <div className="flex justify-center items-center py-12 text-white">
            Grid not found.
          </div>
        ) : !isActive ? (
          <div className="flex justify-center items-center py-12 text-white">
            Not available.
          </div>
        ) : (
          <div
            className="grid gap-0 border border-black"
            style={{
              gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="relative min-h-[180px] bg-[#2b2f36] border border-black overflow-hidden"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt="Grid wall"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/70">
                    Not available
                  </div>
                )}

                {(item.project || item.camera || item.time) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-xs px-3 py-2 flex items-center gap-2">
                    {item.project && (
                      <span className="font-medium truncate">
                        {item.project}
                      </span>
                    )}
                    {item.project && item.camera && (
                      <span className="opacity-70">|</span>
                    )}
                    {item.camera && <span className="truncate">{item.camera}</span>}
                    {item.time && <span className="opacity-70">|</span>}
                    {item.time && <span className="truncate">{item.time}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridWallViewer;
