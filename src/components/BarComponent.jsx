import React, { useContext, useEffect, useState } from "react";
import { BsGrid } from "react-icons/bs";
import { IoEarthOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct way in Vite
const BarComponent = () => {
   const [cameras, setCameras] = useState([]);
     useEffect(() => {
       const fetchCameras = async () => {
         try {
           const res = await fetch(`${API_URL}/camera`);
           const data = await res.json();
           // ✅ Filter unique locations
         const uniqueCameras = data.cameras.filter(
           (camera, index, self) =>
             index === self.findIndex((c) => c.location === camera.location)
         );
         setCameras(uniqueCameras);
           // console.log(data.cameras);
         } catch (error) {
           console.error("Error fetching cameras:", error);
         }
       };
       fetchCameras();
     }, []);
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        All Projects <span className="text-gray-500 text-lg">({cameras.length})</span>
      </h1>
      <div className="flex items-center gap-3">
        <button className="p-2 cursor-pointer rounded-md bg-white">
          <BsGrid />
        </button>
        <Link to="/map" className="p-2 cursor-pointer rounded-md bg-white">
          <IoEarthOutline />
        </Link>
        <select className=" rounded-md px-3 py-1.5 outline-none cursor-pointer text-sm bg-white">
          <option>View: All (2)</option>
        </select>
        <select className=" rounded-md px-3 py-1.5 outline-none cursor-pointer text-sm bg-white">
          <option>Sort by: Default</option>
        </select>
      </div>
    </div>
  );
};

export default BarComponent;
