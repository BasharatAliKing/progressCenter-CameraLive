import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  ShieldCheck,
  UserPlus,
  Eye,
} from "lucide-react";
import { getUserData } from "../utilities/auth";
const API_URL = import.meta.env.VITE_API_URL;
const tabs = [
  { label: "Active users", count: 9, active: true },
  { label: "Pending invites", count: 0, active: false },
  { label: "Guest users", count: 0, active: false },
];



const RolePill = ({ role }) => {
  if (role === "admin") {
    return (
      <span className="inline-flex capitalize items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-600  rounded-full">
        <ShieldCheck size={14} />
        {role}
      </span>
    );
  }
  return (
    <span className="inline-flex capitalize items-center gap-2 px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-600 rounded-full">
      <Eye size={14} />
      {role}
    </span>
  );
};

const StatusToggle = ({ enabled, onToggle }) => (
  <button
    type="button"
    className="flex items-center"
    onClick={onToggle}
    aria-pressed={enabled}
  >
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-emerald-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  </button>
);

const formatLastActive = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const now = new Date();
  const diffMs = Math.abs(now - date);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  return `${diffDays} Day${diffDays === 1 ? "" : "s"} Ago`;
};

export default function UsersPage() {
  const userData = getUserData();
  const [users,setUsers]=useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState({
    username: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    designation: "",
    email: "",
    password: "",
    role: "viewer",
    status: "active",
  });
  const [cameraList, setCameraList] = useState([]);
  const [projectLocations, setProjectLocations] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedCameraIds, setSelectedCameraIds] = useState([]);
  const [statusMap, setStatusMap] = useState(() =>
    users.reduce((acc, user) => {
      const key = user._id || user.id;
      acc[key] = user.status === "active";
      return acc;
    }, {}),
  );
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);
  const usersById = useMemo(() => {
    return users.reduce((acc, currentUser) => {
      const id = currentUser._id || currentUser.id;
      if (id) acc[String(id)] = currentUser;
      return acc;
    }, {});
  }, [users]);

  const handleToggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch(`${API_URL}/camera`);
        const data = await res.json();
        const cameras = Array.isArray(data.cameras) ? data.cameras : [];
        setCameraList(cameras);
        const uniqueLocations = cameras
          .filter((camera) => camera.location)
          .filter(
            (camera, index, self) =>
              index === self.findIndex((c) => c.location === camera.location),
          )
          .map((camera) => camera.location);
        setProjectLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const camerasByLocation = useMemo(() => {
    return cameraList.reduce((acc, camera) => {
      const key = camera.location || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(camera);
      return acc;
    }, {});
  }, [cameraList]);

  const visibleCameras = useMemo(() => {
    if (selectedProjects.length === 0) return [];
    return selectedProjects.flatMap(
      (location) => camerasByLocation[location] || [],
    );
  }, [selectedProjects, camerasByLocation]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    setShowCredentials(false);
    try {
      const userData = localStorage.getItem("auth_user");
      const token = localStorage.getItem("auth_token");
      const user = userData ? JSON.parse(userData) : {};
      const loggedInUserId = user._id || user.id || null;
      const payload = {
        username: formData.username.trim(),
        designation: formData.designation.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        invitedBy: loggedInUserId,
        status: formData.status,
        cameras: selectedCameraIds,
      };
      console.log("Submitting payload:", payload);
      console.log("API URL:", `${API_URL}/register`);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to add user.`,
        );
      }

      setSubmitSuccess("User added successfully.");
      setCreatedCredentials({
        username: formData.username.trim(),
        password: formData.password,
      });
      setShowCredentials(true);
      setFormData({
        username: "",
        designation: "",
        email: "",
        password: "",
        role: "viewer",
        status: "active",
      });
      setSelectedProjects([]);
      setSelectedCameraIds([]);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(()=>{
    const getUsers = async()=>{
        try {
            const res = await fetch(`${API_URL}/users`);
            const data = await res.json();
            setUsers(data.users || []);
            } catch (error) {
            console.error("Error fetching users:", error);
            }
    };
    getUsers();
  },[]);
  const credentialText = `Username: ${createdCredentials.username}
Password: ${createdCredentials.password}
Sign-in url: NESPAK.progresscenter.io`;

  return (
    <div
      className="min-h-screen w-full bg-[url('/Sunrise.jpg')] bg-cover bg-center bg-fixed"
      onClick={() => setOpenMenuId(null)}
    >
      <div className="min-h-screen w-full bg-[#0000002b] ">
        <div className="mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Team Management
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  <span className="text-gray-500">Show</span>
                  <select
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-700 outline-none"
                    value={pageSize}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setPageSize(value);
                      setCurrentPage(1);
                    }}
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {userData?.role === "admin" && (
                  <>
                    <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                      <Download size={16} />
                      Export users
                    </button>
                    <button
                      className="flex items-center gap-2 rounded-md cursor-pointer bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
                      onClick={() => {
                        setSubmitError("");
                        setSubmitSuccess("");
                        setIsAddUserOpen(true);
                      }}
                    >
                      <UserPlus size={16} />
                      Add user
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`rounded-md cursor-pointer px-4 py-2 text-sm font-semibold transition ${
                    tab.active
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white/80 via-white/70 to-white/60 backdrop-blur-sm shadow-sm overflow-y-auto">
              <div className="px-6 py-4 bg-white">
                <div className="grid grid-cols-[60px_220px_220px_220px_120px_100px_120px_90px_70px] items-center text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  <div>S.No</div>
                  <div>User Name</div>
                  <div>Email Address</div>
                  <div>Added/Invited By</div>
                  <div>Roles</div>
                  <div>Last Active</div>
                  <div>Status</div>
                  <div>Action</div>
                </div>
              </div>
              <div className="divide-y divide-[#e5e7eb]">
                {paginatedUsers.map((user,index) => (
                  <div
                    key={user._id}
                    className="grid cursor-pointer hover:bg-white/30 grid-cols-[60px_220px_220px_220px_120px_100px_120px_90px_70px] items-center px-6 py-4 text-sm text-gray-700"
                  >
                    <div className="font-semibold text-gray-900">{index + 1}</div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center bg-primary rounded-full text-sm font-semibold text-white ${user.avatarColor}`}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold capitalize text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.designation}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {user.email}
                    </div>
                    <div className="flex">
                       {user.invitedBy === ' ' ? '-' : 
                       <>
                        <div className="bg-amber-600 my-auto h-8 w-8 flex items-center justify-center rounded-full text-sm font-semibold text-white">
                             {usersById[String(user.invitedBy)]?.username
                          ? usersById[String(user.invitedBy)].username
                              .charAt(0)
                              .toUpperCase()
                          : "-"}
                        </div>
                     <div className="ml-2">
                         <div className="font-semibold capitalize text-gray-900">
                         {usersById[String(user.invitedBy)]?.username || "-"}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {usersById[String(user.invitedBy)]?.designation || "-"}
                      </div>
                     </div>
                       </>
                     }
                    </div>
                    <div>
                      <RolePill role={user.role} />
                    </div>
                   
                    <div className="text-gray-600">
                      {formatLastActive(user.lastActive)}
                    </div>
                    <div>
                      <StatusToggle
                        enabled={
                          statusMap[user._id || user.id] ??
                          user.status === "active"
                        }
                        onToggle={(event) => {
                          event.stopPropagation();
                          const key = user._id || user.id;
                          setStatusMap((prev) => ({
                            ...prev,
                            [key]: !(prev[key] ?? user.status === "active"),
                          }));
                        }}
                      />
                    </div>
                    <div className="relative flex items-center cursor-pointer justify-start">
                      <button
                        className="rounded-full cursor-pointer p-2 text-gray-500 hover:bg-gray-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleMenu(user.id);
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                      {/* {openMenuId === user.id && (
                        <div
                          className="absolute cursor-pointer right-0 top-10 z-20 w-44 rounded-xl border border-gray-200 bg-white shadow-lg"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            className="w-full px-4 font-medium py-2 cursor-pointer text-left text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Reset Password
                          </button>
                          <button
                            className="w-full px-4 font-medium py-2 cursor-pointer text-left text-sm text-red-600 hover:bg-red-50"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Delete Account
                          </button>
                        </div>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 text-sm text-gray-600">
                <div>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + pageSize, users.length)} of{" "}
                  {users.length} users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 disabled:opacity-50"
                    onClick={(event) => {
                      event.stopPropagation();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                          currentPage === page
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 disabled:opacity-50"
                    onClick={(event) => {
                      event.stopPropagation();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddUserOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsAddUserOpen(false)}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
          isAddUserOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add User</h2>
              <p className="text-xs text-gray-500">Create a new team member</p>
            </div>
            <button
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              onClick={() => setIsAddUserOpen(false)}
            >
              ✕
            </button>
          </div>
          <form
            className={`flex-1 overflow-y-auto px-6 py-5 ${
              showCredentials ? "hidden" : "block"
            }`}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Username
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Designation
                </label>
                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleFormChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Enter designation"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Enter password"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="banned">banned</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Active Projects
                </label>
                <div className="mt-2 grid gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm">
                  {projectLocations.length === 0 && (
                    <span className="text-xs text-gray-500">
                      No active projects found.
                    </span>
                  )}
                  {projectLocations.map((location) => (
                    <label key={location} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedProjects.includes(location)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSelectedProjects((prev) =>
                            checked
                              ? [...prev, location]
                              : prev.filter((item) => item !== location),
                          );
                        }}
                      />
                      <span className="font-medium text-gray-700">
                        {location}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">
                  Cameras
                </label>
                <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 text-sm">
                  {visibleCameras.length === 0 ? (
                    <span className="text-xs text-gray-500">
                      Select a project to view cameras.
                    </span>
                  ) : (
                    visibleCameras.map((camera) => (
                      <label
                        key={camera._id}
                        className="flex items-center gap-2 py-1"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedCameraIds.includes(camera._id)}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setSelectedCameraIds((prev) =>
                              checked
                                ? [...prev, camera._id]
                                : prev.filter((id) => id !== camera._id),
                            );
                          }}
                        />
                        <span className="text-gray-700">
                          {camera.name || camera.location}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {selectedCameraIds.length > 0 && (
                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    Selected camera IDs: {selectedCameraIds.join(", ")}
                  </div>
                )}
              </div>
              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
                  {submitSuccess}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Create User"}
              </button>
            </div>
          </form>
          {showCredentials ? (
            <div className="border-t border-gray-200 px-6 py-5">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <div className="mb-2 font-semibold">Share credentials</div>
                <div className="whitespace-pre-line text-xs text-emerald-800">
                  {credentialText}
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(credentialText);
                    setSubmitSuccess("Credentials copied to clipboard.");
                  } catch (error) {
                    setSubmitError("Unable to copy credentials.");
                  }
                }}
              >
                Copy credentials
              </button>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                onClick={() => {
                  setShowCredentials(false);
                  setSubmitSuccess("");
                }}
              >
                Add another user
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
