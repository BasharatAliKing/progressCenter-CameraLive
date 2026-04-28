// FILE: Sidebar.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  PlusSquare,
  Puzzle,
  MessageCircle,
  User,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/dashboard" },
    { label: "Teams & Users", icon: <User size={22} />, path: "/users" },
    { label: "Documents", icon: <FileText size={22} />, path: "/documents" },
    { label: "ProgressLine", icon: <PlusSquare size={22} />, path: "/progressline" },
    { label: "Plugins", icon: <Puzzle size={22} />, path: "/plugins" },
    { label: "Support", icon: <MessageCircle size={22} />, path: "/support" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#e7e4dc] shadow-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img className="h-7 w-9" src="/nespak-logo.png" alt="logo" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-800 text-sm">Progress</span>
            <span className="text-[11px] text-gray-400 -mt-1">center</span>
          </div>
        </div>

        <button onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[#e7e4dc] shadow-md flex flex-col justify-between
          transition-all duration-300 z-50

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0

          ${expanded ? "lg:w-64" : "lg:w-20"}
          w-64
        `}
        onMouseEnter={() => window.innerWidth >= 1024 && setExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 1024 && setExpanded(false)}
      >
        {/* Logo */}
        <div className="px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img className="h-7 w-9" src="/nespak-logo.png" alt="logo" />
            {(expanded || mobileOpen) && (
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-gray-800 text-sm">Progress</span>
                <span className="text-[11px] text-gray-400 -mt-1">center</span>
              </div>
            )}
          </div>

          {/* Mobile Close */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col px-2 space-y-2 mb-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <div
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center ${
                  expanded || mobileOpen
                    ? "justify-start px-4"
                    : "justify-center"
                } space-x-3 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {(expanded || mobileOpen) && (
                  <span className="text-base">{item.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;