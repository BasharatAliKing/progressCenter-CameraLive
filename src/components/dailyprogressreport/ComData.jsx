import React from "react";

const ComData = ({
  contractValue = 0,
  certifiedToDate = "",
  cumulativePercentage = 0,
  confirmedVariations = 0,
  revisedContractValue = 0,
  costOfChanges = 0,
}) => {
  
  return (
    <div>
      <div className="block py-2">
        <div className="block bg-primary rounded-md p-2 w-full">
          <h1 className="text-center text-white font-bold">Commercial Data</h1>
        </div>
      </div>

      <div className="block rounded-md p-2 w-full bg-[#e7e4dc]">
        <div className="flex flex-col space-y-2 px-3 py-1">
          <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col items-start">
              <span className="font-semibold">Contract Value:</span>
              <span className="">{contractValue}</span>
            </div>
          <div className="flex flex-col items-start">
              <span className="font-semibold">Confirmed Variations</span>
              <span className="">{confirmedVariations} days</span>
            </div>
           <div className="flex flex-col items-start">
              <span className="font-semibold">Revised Contract Value:</span>
              <span className="">{revisedContractValue}</span>
            </div>
           <div className="flex flex-col items-start">
              <span className="font-semibold">
                Cumullative Percentage Certified:
              </span>
              <span className="">{cumulativePercentage}</span>
            </div>
           <div className="flex flex-col items-start">
              <span className="font-semibold">Certified to Date:</span>
              <span className="">{certifiedToDate}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold">Cost of Changes:</span>
              <span className="">{costOfChanges}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComData;
