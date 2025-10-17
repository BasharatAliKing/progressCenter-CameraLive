import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Sidebar from '../layouts/Sidebar'
const MainOutlet = () => {
  return (
    <div className=" w-[100%]  bg-gray-50">
      <Navbar />
      <Sidebar />
      <div className="pt-14 pl-20 h-full">
        <Outlet/>
      </div>
    </div>
  )
}

export default MainOutlet
