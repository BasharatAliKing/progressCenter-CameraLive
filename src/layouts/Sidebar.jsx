// FILE: Sidebar.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  PlusSquare,
  Puzzle,
  MessageCircle,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/dashboard" },
    { label: "Teams & Users", icon: <User size={22} />, path: "/teams" },
    { label: "Documents", icon: <FileText size={22} />, path: "/documents" },
    { label: "ProgressLine", icon: <PlusSquare size={22} />, path: "/progressline" },
    { label: "Plugins", icon: <Puzzle size={22} />, path: "/plugins" },
    { label: "Support", icon: <MessageCircle size={22} />, path: "/support" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-md border-r border-gray-200 
                  flex flex-col justify-between transition-all duration-300 z-40 
                  ${expanded ? "w-64" : "w-20"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="px-4 py-6 flex">
        {expanded ? (
          <div className="flex items-center space-x-2">
            <img className="h-7 w-9" src="/nespak-logo.png" alt="logo" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-gray-800 text-sm">
                Progress
              </span>
              <span className="text-[11px] text-gray-400 -mt-1">center</span>
            </div>
          </div>
        ) : (
          <img className="h-7 w-9" src="/nespak-logo.png" alt="logo" />
        )}
      </div>

      {/* Menu Items */}
      <div className="flex flex-col px-2 space-y-2 mb-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center ${
                expanded ? "justify-start px-4" : "justify-center"
              } space-x-3 py-2 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {expanded && <span className="text-base">{item.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
