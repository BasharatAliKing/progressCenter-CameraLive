import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { authHeader } from "../../utilities/auth";
import EditGridCellSidebar from "../../components/pluginPage/grid/EditGridCellSidebar";
import CreateGridWallSidebar from "../../components/pluginPage/CreateGridWallSidebar";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;

const formatTitle = (value, fallback = "GridWall") => {
  if (!value) return fallback;
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const GridWallsites = () => {
  const { id, pluginname, gridId } = useParams();
  const location = useLocation();
  const [isActive, setIsActive] = useState(true);
  const [gridInfo, setGridInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCellId, setEditCellId] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraProjects, setCameraProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [cameraMap, setCameraMap] = useState({});
  const [snapshotMap, setSnapshotMap] = useState({});
  const [isGridEditOpen, setIsGridEditOpen] = useState(false);
  const [isGridSubmitting, setIsGridSubmitting] = useState(false);
  const [isCellSaving, setIsCellSaving] = useState(false);
  const [gridFormData, setGridFormData] = useState({
    name: "",
    layout: "1",
    showDateTime: false,
    showProjectName: false,
    showCameraName: false,
  });

  const pluginTitle = formatTitle(location.state?.pluginTitle || pluginname);
  const gridTitle = gridInfo?.name || location.state?.title || "GridWall";

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
      const selected = result?.data?.find((item) => item._id === gridId);
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
  }, [gridId]);

  useEffect(() => {
    if (gridInfo?.status) {
      setIsActive(gridInfo.status.toLowerCase() === "active");
    }
  }, [gridInfo]);

  useEffect(() => {
    if (!isEditOpen) return;

    const fetchCameras = async () => {
      try {
        setCameraLoading(true);
        setCameraError(null);
        const response = await fetch(`${API_URL}/camera`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cameras");
        }

        const result = await response.json();
        const rawCameras =
          result?.cameras ||
          result?.data ||
          (Array.isArray(result) ? result : []);

        const projectsMap = new Map();
        rawCameras.forEach((camera) => {
          const projectName =
            camera.projectName ||
            camera.project?.name ||
            camera.location ||
            "Unknown Project";
          const projectId =
            camera.projectId ||
            camera.project?._id ||
            camera.location ||
            projectName;
          if (!projectsMap.has(projectId)) {
            projectsMap.set(projectId, {
              id: projectId,
              name: projectName,
              city: camera.city || camera.project?.city || "—",
              status: camera.status || camera.project?.status || "inactive",
              image: camera.image || camera.project?.image || null,
              cameras: [],
            });
          }
          projectsMap.get(projectId).cameras.push(camera);
        });

        const projectList = Array.from(projectsMap.values());
        setCameraProjects(projectList);
        if (projectList.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectList[0].id);
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
        setCameraError(err.message);
      } finally {
        setCameraLoading(false);
      }
    };

    fetchCameras();
  }, [isEditOpen]);

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

  const getCameraIdsForLayout = () => {
    const slotCount = getSlotCount(gridInfo?.layout);
    const cameraIds = Array.isArray(gridInfo?.cameraIds)
      ? [...gridInfo.cameraIds]
      : [];
    if (cameraIds.length < slotCount) {
      return [...cameraIds, ...Array(slotCount - cameraIds.length).fill(null)];
    }
    return cameraIds.slice(0, slotCount);
  };

  const handleGridFormChange = (field, value) => {
    setGridFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenGridEdit = () => {
    if (!gridInfo) return;
    setGridFormData({
      name: gridInfo.name || "",
      layout: gridInfo.layout || "1",
      showDateTime: !!gridInfo.showDateTime,
      showProjectName: !!gridInfo.showProjectName,
      showCameraName: !!gridInfo.showCameraName,
    });
    setIsGridEditOpen(true);
  };

  const handleCloseGridEdit = () => {
    setIsGridEditOpen(false);
  };

  const handleGridUpdate = async (event) => {
    event.preventDefault();
    if (!gridInfo?._id) return;

    try {
      setIsGridSubmitting(true);
      const payload = {
        name: gridFormData.name.trim(),
        layout: gridFormData.layout,
        showDateTime: gridFormData.showDateTime,
        showProjectName: gridFormData.showProjectName,
        showCameraName: gridFormData.showCameraName,
      };

      const response = await fetch(`${API_URL}/gridwall/${gridInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update grid");
      }

      await response.json();
      setIsGridEditOpen(false);
      fetchGrid();
    } catch (err) {
      console.error("Error updating grid:", err);
      setError(err.message);
    } finally {
      setIsGridSubmitting(false);
    }
  };

  const handleOpenCellEdit = (cellId) => {
    const cameraIds = getCameraIdsForLayout();
    setEditCellId(cellId);
    setSelectedCameraId(cameraIds[cellId - 1] || null);
    setIsEditOpen(true);
  };

  const handleSaveCell = async () => {
    if (!gridInfo?._id || !editCellId) return;

    try {
      setIsCellSaving(true);
      const cameraIds = getCameraIdsForLayout();
      cameraIds[editCellId - 1] = selectedCameraId || null;

      const payload = {
        name: gridInfo.name,
        layout: gridInfo.layout,
        showDateTime: gridInfo.showDateTime,
        showProjectName: gridInfo.showProjectName,
        showCameraName: gridInfo.showCameraName,
        cameraIds,
      };

      const response = await fetch(`${API_URL}/gridwall/${gridInfo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update grid cell");
      }

      await response.json();
      setIsEditOpen(false);
      setEditCellId(null);
      fetchGrid();
    } catch (err) {
      console.error("Error updating grid cell:", err);
      setError(err.message);
    } finally {
      setIsCellSaving(false);
    }
  };

  return (
    <div className="bg-[url('/Sunrise.jpg')] bg-no-repeat bg-center bg-cover min-h-[calc(100vh-56px)]">
      <div className="bg-[#ffffffc9] px-8 py-5 pt-6 border-b border-black/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-sm text-[#667085]">
                <Link
                  className="text-[#667085] duration-500 hover:scale-105"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
                {" / "}
                <Link
                  className="text-[#667085] duration-500 hover:scale-105"
                  to="/plugins"
                >
                  Plugins
                </Link>
                {" / "}
                <Link
                  to={`/plugins/${id}/${pluginname}`}
                  className="font-medium text-[#667085]"
                >
                  {pluginTitle}
                </Link>
                {" / "}
                <span className="font-medium text-[#101828]">{gridTitle}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {pluginTitle} - {gridTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-xl bg-white shadow border border-black/10 grid place-items-center hover:shadow-md transition">
                <svg
                  className="w-6 h-6 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
                </svg>
              </button>
              <button
                className="w-12 h-12 cursor-pointer rounded-xl bg-white shadow border border-black/10 grid place-items-center hover:shadow-md transition"
                onClick={handleOpenGridEdit}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3 bg-white shadow border border-black/10 rounded-full px-4 py-2">
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
                <button
                  type="button"
                  onClick={() => setIsActive((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-600">
            Loading grid data...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12 text-red-600">
            Error: {error}
          </div>
        ) : !gridInfo ? (
          <div className="flex justify-center items-center py-12 text-gray-600">
            Grid not found.
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
                className="relative h-[200px] bg-[#f0f2f5] border border-black overflow-hidden"
              >
                <button
                  className="absolute cursor-pointer top-2 right-2 z-10 w-8 h-8 rounded-md bg-white shadow border border-black/10 grid place-items-center"
                  onClick={() => handleOpenCellEdit(item.id)}
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                {item.image ? (
                  <img
                    src={item.image}
                    alt="Grid wall"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-lg bg-blue-100 grid place-items-center">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
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
                    {item.camera && (
                      <span className="truncate">{item.camera}</span>
                    )}
                    {item.time && <span className="opacity-70">|</span>}
                    {item.time && <span className="truncate">{item.time}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <EditGridCellSidebar
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        cameraLoading={cameraLoading}
        cameraError={cameraError}
        cameraProjects={cameraProjects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        selectedCameraId={selectedCameraId}
        onSelectCamera={setSelectedCameraId}
        editCellId={editCellId}
        imagePath={IMAGE_PATH}
        onSave={handleSaveCell}
        isSaving={isCellSaving}
      />

      <CreateGridWallSidebar
        isOpen={isGridEditOpen}
        onClose={handleCloseGridEdit}
        formData={gridFormData}
        onFormChange={handleGridFormChange}
        onSubmit={handleGridUpdate}
        isSubmitting={isGridSubmitting}
        isEditMode
      />
    </div>
  );
};

export default GridWallsites;
