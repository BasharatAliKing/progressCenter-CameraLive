import { Cctv } from 'lucide-react'
import React, { useState } from 'react'
import { GiProgression } from 'react-icons/gi';
import { GrSchedule } from 'react-icons/gr';
import LiveProgress from '../components/LiveProgress';
import OverAllProgress from '../components/OverAllProgress';
import DetailedSchedule from '../components/DetailedSchedule';

const Camera = () => {
    const [view,setView]=useState(0);
  return (
    <div className='flex min-h-screen py-5 flex-col gap-5 bg-[url("/Sunrise.jpg")] bg-no-repeat bg-center bg-cover'>
       <div className="flex gap-5 mt-2 px-5">
        <button onClick={(e)=>{setView(0)}} className={`flex cursor-pointer ${view===0 ? 'text-primary border-b-2 pb-1':'text-secondary'} itemx-center justify-center gap-1 font-medium text-sm md:text-base `} ><Cctv size="20"/> Live Progress</button>
        <button onClick={(e)=>{setView(1)}} className={`flex cursor-pointer ${view===1 ? 'text-primary border-b-2 pb-1':'text-secondary'} itemx-center justify-center gap-1 font-medium text-sm md:text-base `} ><GiProgression size="20"/> Overall Progress</button>
        <button onClick={(e)=>{setView(2)}} className={`flex cursor-pointer ${view===2 ? 'text-primary border-b-2 pb-1':'text-secondary'} itemx-center justify-center gap-1 font-medium text-sm md:text-base `} ><GrSchedule size="20"/> Detailed Schedule</button>
       </div>
       <div className="flex">
        {
            view===0 ?
            <LiveProgress/>
           : view===1 ?
           <OverAllProgress/>
           :
           <div className="mx-5 overflow-y-auto">
            <DetailedSchedule/>
           </div>
        }
       </div>
      
    </div>
  )
}

export default Camera
