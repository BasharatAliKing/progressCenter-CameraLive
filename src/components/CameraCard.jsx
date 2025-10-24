import { Eye, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
const IMAGE_PATH=import.meta.env.VITE_IMAGE_PATH;// Correct Image Path
const CameraCard = ({camera, funcimg }) => {
  const params = useParams();
  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-3">
      <div className="img relative">
          {/* Live badge */}
            <Link to={`/live-view/${camera._id}`} title="Live View" className="absolute cursor-pointer top-2 left-3 flex items-center gap-1 bg-[#ffffff7d] px-2 py-1 rounded-md text-white text-sm">
              <PlayCircle className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-[14px] font-medium text-black">Live</span>
            </Link>
        <Eye
          onClick={(e) => {
            funcimg(true);
          }}
          size="20"
          className="cursor-pointer bg-white absolute top-3 right-2 p-1 rounded-sm"
        />
        <img
          src={`${IMAGE_PATH}${camera.image}`}
          alt="my-img"
          className="rounded-md cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-1 font-semibold text-base">
          <span className="h-2 w-2 mt-[2px] flex rounded-full bg-green-500"></span>
          {camera.name}
        </h1>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h3 className="text-[12px] text-secondary">Last Updated</h3>
            <p className=" text-[10px]">
              {new Date(camera.updatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
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
      </div>
    </div>
  );
};

export default CameraCard;
