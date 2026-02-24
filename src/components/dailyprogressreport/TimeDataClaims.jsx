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
      <div className="block px-3 py-2">
        <div className="block bg-green-200 rounded-md p-2 w-full">
          <h1 className="text-center text-black font-bold">
            Time Data and Claims
          </h1>
        </div>
      </div>

      <div className="block border border-gray-400 rounded-md p-2 w-full">
        <div className="flex flex-col space-y-2 bg-amber-50 px-3 py-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Commencement Date:</span>
              <span className="ml-2">{commencementDate}</span>
            </div>
            <div>
              <span className="font-semibold">Duration:</span>
              <span className="ml-2">{duration} days</span>
            </div>
            <div>
              <span className="font-semibold">Completion Date:</span>
              <span className="ml-2">{completion}</span>
            </div>
            <div>
              <span className="font-semibold">Forecast Completion:</span>
              <span className="ml-2">{forecastCompletion}</span>
            </div>
            <div>
              <span className="font-semibold">EOT Granted:</span>
              <span className="ml-2">{eot} days</span>
            </div>
            <div>
              <span className="font-semibold">Anticipated EOT:</span>
              <span className="ml-2">{anticipatedEot} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDataClaims;
