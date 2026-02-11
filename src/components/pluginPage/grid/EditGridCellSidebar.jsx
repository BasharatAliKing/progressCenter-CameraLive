import React from "react";

const EditGridCellSidebar = ({
  isOpen,
  onClose,
  cameraLoading,
  cameraError,
  cameraProjects,
  selectedProjectId,
  onSelectProject,
  selectedCameraId,
  onSelectCamera,
  editCellId,
  imagePath,
  onSave,
  isSaving = false,
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[360px] bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Grid Cell
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Select Project & Camera
            </h3>
            {cameraLoading ? (
              <div className="text-sm text-gray-500">Loading cameras...</div>
            ) : cameraError ? (
              <div className="text-sm text-red-600">Error: {cameraError}</div>
            ) : cameraProjects.length === 0 ? (
              <div className="text-sm text-gray-500">No cameras found.</div>
            ) : (
              <div className="space-y-4">
                {cameraProjects.map((project) => {
                  const isSelected = project.id === selectedProjectId;
                  return (
                    <div
                      key={project.id}
                      className={`rounded-xl border ${
                        isSelected
                          ? "border-blue-500 shadow-sm"
                          : "border-gray-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectProject(project.id)}
                        className="w-full cursor-pointer flex items-center justify-between gap-3 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 cursor-pointer rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={
                                project.image
                                  ? `${imagePath || ""}${project.image}`
                                  : "/card-1.jpg"
                              }
                              alt={project.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {project.name}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  project.status?.toLowerCase() === "active"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {project.status?.toLowerCase() === "active"
                                  ? "ACTIVE"
                                  : "INACTIVE"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {project.city}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 text-gray-400 transition ${
                              isSelected ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          <span
                            className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-blue-600" : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </span>
                        </div>
                      </button>

                      {isSelected && (
                        <div className="border-t cursor-pointer border-gray-200 px-3 py-3 space-y-2">
                          <div className="text-xs font-semibold text-gray-600">
                            Cameras
                          </div>
                          {project.cameras.length === 0 ? (
                            <div className="text-xs text-gray-500">
                              No cameras found.
                            </div>
                          ) : (
                            project.cameras.map((camera) => (
                              <label
                                key={camera._id || camera.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-10 rounded-md bg-gray-100 overflow-hidden">
                                    <img
                                      src={
                                        camera.image
                                          ? `${imagePath || ""}${camera.image}`
                                          : "/card-1.jpg"
                                      }
                                      alt={
                                        camera.name ||
                                        camera.location ||
                                        "Camera"
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-800">
                                    {camera.name || camera.location || "Camera"}
                                  </span>
                                </div>
                                <input
                                  type="radio"
                                  name="grid-camera"
                                  className="h-4 w-4 text-blue-600 border-gray-300"
                                  checked={
                                    selectedCameraId ===
                                    (camera._id || camera.id)
                                  }
                                  onChange={() =>
                                    onSelectCamera(camera._id || camera.id)
                                  }
                                />
                              </label>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
              onClick={onSave}
              disabled={isSaving || !selectedCameraId}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
          {editCellId && (
            <div className="text-[11px] text-gray-400">
              Editing cell #{editCellId}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditGridCellSidebar;
