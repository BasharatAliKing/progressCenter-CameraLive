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
      <div className="block px-3 py-2">
        <div className="block bg-green-200 rounded-md p-2 w-full">
          <h1 className="text-center text-black font-bold">Commercial Data</h1>
        </div>
      </div>

      <div className="block border border-gray-400 rounded-md p-2 w-full">
        <div className="flex flex-col space-y-2 bg-amber-50 px-3 py-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Contract Value:</span>
              <span className="ml-2">{contractValue}</span>
            </div>
            <div>
              <span className="font-semibold">Confirmed Variations</span>
              <span className="ml-2">{confirmedVariations} days</span>
            </div>
            <div>
              <span className="font-semibold">Revised Contract Value:</span>
              <span className="ml-2">{revisedContractValue}</span>
            </div>
            <div>
              <span className="font-semibold">
                Cumullative Percentage Certified:
              </span>
              <span className="ml-2">{cumulativePercentage}</span>
            </div>
            <div>
              <span className="font-semibold">Certified to Date:</span>
              <span className="ml-2">{certifiedToDate}</span>
            </div>
            <div>
              <span className="font-semibold">Cost of Changes:</span>
              <span className="ml-2">{costOfChanges}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComData;
