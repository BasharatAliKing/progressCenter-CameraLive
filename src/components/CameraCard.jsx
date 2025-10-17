import { Eye, } from 'lucide-react'
import { Link } from 'react-router-dom'
const CameraCard = ({funcimg}) => {
  return (
    <div className='bg-white p-4 rounded-md flex flex-col gap-3'>
       
      <div className="img relative">
        <Eye onClick={(e)=>{funcimg(true)}} size="20" className='cursor-pointer bg-white absolute top-2 right-2 p-1 rounded-sm' />
        <img src="/card-1.jpg" alt="my-img" className='rounded-md cursor-pointer' />
      </div>
        <Link to="/live-view" className="flex flex-col gap-2">
            <h1 className='flex items-center gap-1 font-semibold text-base'><span className='h-2 w-2 mt-[1px] flex rounded-full bg-green-500'></span> Camera 1</h1>
        <div className="flex justify-between">
            <div className="flex flex-col">
                <h3 className='text-[12px] text-secondary'>Last Updated</h3>
                <p className='text-[10px]'>12:00 pm - 08 Oct, 2025</p>
            </div>
            <div className="flex flex-col">
                <h3 className='text-[12px] text-secondary'>Installed on</h3>
                <p className='text-[10px]'>27 Sept, 2025</p>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default CameraCard
