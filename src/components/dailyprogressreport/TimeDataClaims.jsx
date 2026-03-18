import React from "react";

const TimeDataClaims = ({
  commencementDate = "23-09-23",
  duration = 0,
  completion = "",
  forecastCompletion = "",
  eot = 0,
  anticipatedEot = 0,
}) => {
  return (
    <div>
      <div className="block py-2 ">
        <div className="block bg-primary rounded-md p-2 w-full">
          <h1 className="text-center text-white font-bold">
            Time Data and Claims
          </h1>
        </div>
      </div>

      <div className="block bg-[#e7e4dc] rounded-md p-2 w-full">
        <div className="flex flex-col space-y-2  px-3 py-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-start">
              <span className="font-semibold">Commencement Date:</span>
              <span className="">{commencementDate}</span>
            </div>
           <div className="flex flex-col items-start">
              <span className="font-semibold">Duration:</span>
              <span className="">{duration} days</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold">Completion Date:</span>
              <span className="">{completion}</span>
            </div>
           <div className="flex flex-col items-start">
              <span className="font-semibold">Forecast Completion:</span>
              <span className="">{forecastCompletion}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold">EOT Granted:</span>
              <span className="">{eot} days</span>
            </div>
           <div className="flex flex-col items-start">
              <span className="font-semibold">Anticipated EOT:</span>
              <span className="">{anticipatedEot} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDataClaims;
