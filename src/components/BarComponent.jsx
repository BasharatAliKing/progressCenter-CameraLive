import React from "react";
import { BsGrid } from "react-icons/bs";
import { IoEarthOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const BarComponent = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        All Projects <span className="text-gray-500 text-lg">(2)</span>
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
