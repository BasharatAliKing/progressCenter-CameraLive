import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Globe2,
  Search,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const raw =
      localStorage.getItem("auth_user") || localStorage.getItem("user_data");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  const initials = useMemo(() => {
    const name = user?.username || user?.name || user?.fullName || "User";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  const displayName =
    user?.username || user?.name || user?.fullName || "User";
  const displayRole = user?.role || "Viewer";

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("user_data");
    localStorage.removeItem("auth_expires_at");
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 h-16 bg-[#e7e4dc] backdrop-blur-md 
                 flex items-center justify-between px-6 shadow-md z-40 border-b border-gray-200"
    >
      {/* Left - Logo + Search */}
      <div className="flex items-center space-x-4 w-1/2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center bg-gradient-to-br from-yellow-400 to-pink-500 text-white rounded-md w-9 h-9 font-bold shadow-sm">
            <Globe2 size={20} />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center ml-5 md:ml-15 w-full max-w-md bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-primary transition-all">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for anything"
            className="bg-transparent w-full outline-none text-sm ml-2 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right - Icons */}
      <div className="flex items-center space-x-6 text-gray-700">
        {/* Notification */}
        <div className="relative cursor-pointer group">
          <Bell
            size={22}
            className="transition-transform group-hover:scale-110 group-hover:text-primary"
          />
          <span
            className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
            title="Notifications"
          ></span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
              {initials}
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-medium capitalize text-gray-800">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 capitalize ">{displayRole}</span>
            </div>

            {/* Dropdown arrow */}
            <ChevronDown
              size={18}
              className={`text-gray-600 transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-fade-in">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings size={16} className="mr-2" />
                Account
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
