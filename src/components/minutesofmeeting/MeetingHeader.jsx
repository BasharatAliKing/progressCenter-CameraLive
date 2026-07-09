import React from "react";

const MeetingHeader = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full grid grid-cols-4 p-8 gap-18 justify-between items-center mb-4">
        <div className="flex justify-around items-center gap-2">
          <img src="/public/nespak-logo.png" alt="" className="w-[70px]" />
          <img src="/public/nespak-logo.png" alt="" className="w-[70px]" />
        </div>
        <h1 className="text-center col-span-2 border border-gray-500 p-2 pt-[6px] rounded-md whitespace-nowrap font-bold text-2xl tracking-wide">
          Minutes of Meeting
        </h1>
        <div className="flex justify-around">
          <img src="/public/nespak-logo.png" alt="" className="w-[70px]" />
        </div>
      </div>
      <h1 className="text-center p-2 text-xl font-bold border-t border-black bg-gray-300">
        NEW MASS TRANSIT LINE IN GUJRANWALA (YELLOW LINE) PKG - III
      </h1>
      <div className="grid grid-cols-4 bg-gray-300">
        <div className="flex items-center text-base border-t border-r border-black justify-center p-2">
          <h2>
            {" "}
            <b>Venue:</b> Conference Room
          </h2>
        </div>
        <div className="flex items-center text-base border-t border-r border-black justify-center p-2">
          <h2>
            {" "}
            <b>Date:</b> 09 Jul 2026
          </h2>
        </div>
        <div className="flex items-center text-base border-t border-r border-black justify-center p-2">
          <h2>
            {" "}
            <b>Meeting No:</b> 01
          </h2>
        </div>
        <div className="flex items-center text-base border-t border-black justify-center p-2">
          <h2>
            <b>Time:</b> 11:00 AM
          </h2>
        </div>
      </div>
      <h1 className=" p-1 px-2 border-t border-black text-base ">
        <b>Agenda Of Meeting: </b>A meeting was held at the Project Site office
        and attended by the participants mentioned below. The agenda of the
        meeting was to review HSE Compliance Status.
      </h1>
      <h1 className=" p-1 px-2 border-t border-black text-base ">
        <b>Meeting Chaired by : </b>In Charge HSE NESPAK 
      </h1>
       <h1 className="text-center p-2 text-xl font-bold border-t border-black bg-gray-300">
     MEETING PARTICIPANTS
      </h1>
    </div>
  );
};

export default MeetingHeader;
