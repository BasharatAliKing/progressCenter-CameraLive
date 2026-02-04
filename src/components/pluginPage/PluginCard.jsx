import React from 'react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;
const PluginCard = ({ id, logo, title, description, status, onClick }) => {
  const isActive = status?.toLowerCase() === 'active';

  return (
    <Link to={status === 'Inactive' ? '#' : `/plugins/${id}/${title.toLowerCase()}`} 
      onClick={onClick}
      className="bg-gradient-to-br from-[#f5f5f0] to-[#fffaf5] rounded-2xl p-6 shadow-md gap-1 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 border border-black/5 cursor-pointer flex flex-col h-full"
    >
        <span className={`px-3 py-1.5 ml-auto rounded-full text-[10px] font-semibold uppercase tracking-wide ${
          isActive 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-300 text-gray-700'
        }`}>
          {status}
        </span>
          <img 
              src={`${VITE_IMAGE_PATH}${logo}`} 
              alt={title}
              className="mb-2 w-[132px] h-[32px]"
            />
     <h3 className="text-lg font-bold text-gray-900  flex-shrink-0">{title}</h3>
      <p className="text-xs text-gray-600 leading-relaxed flex-grow">{description}</p>
    </Link>
  );
};

export default PluginCard;
