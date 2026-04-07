import React, { useState, useEffect } from "react";

const ProjectHeader = (props) => {
  const {
    employer,
    contractor,
    consultant,
    project,
    commencement_date,
    completion_date,
    location,
    reportNo,
    monthNo,
    elapsed_date,
    remaining_days,
    weekNo,
    totalDays,
  } = props;

  const [currentDate, setCurrentDate] = useState("");
  const [elapsedDays, setElapsedDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  function getWeekOfMonth(date) {
    const d = new Date(date);
    return Math.ceil(d.getDate() / 7);
  }

  const commendementDate = new Date(commencement_date);
  const today = new Date();
  // calculate difference in milliseconds
  const elapsedDate = today - commendementDate;
  // convert to days
  const elapsedDaysCalc = Math.ceil(elapsedDate / (1000 * 60 * 60 * 24));

  const remainingDaysCalc = Math.ceil(
    (new Date(completion_date) - today) / (1000 * 60 * 60 * 24),
  );
  // get LIve Curent MOnth
const currentMonth = today.toLocaleString("default", { month: "long" });

  // usage
  const weekno = getWeekOfMonth(new Date());
  useEffect(() => {
    // Set current date using window features
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setCurrentDate(formattedDate);

    // // Example calculation (replace with logic)
    // const elapsed = 290;
    // setElapsedDays(elapsed);
    // setRemainingDays(totalDays - elapsed);
  }, [totalDays]);

  return (
    <div className=" rounded-md py-2 mb-4 border border-white w-full">
      <div className="flex justify-between rounded-md py-2 px-4  space-x-1 bg-[#e7e4dc] ">
        <span className="font-semibold">Employer : {employer}</span>
        <span className="font-semibold">Contractor : {contractor}</span>
      </div>

      <div className="flex justify-between mt-2 rounded-md py-2 px-4 bg-[#e7e4dc] ">
        <span className="font-semibold">Project: {project}</span>
        <span className="font-semibold">Consultant : {consultant}</span>
      </div>

      <div className="mt-2 rounded-md grid grid-cols-6 text-center bg-[#e7e4dc]">
        <div className="border rounded-l-md border-gray-400 p-1">
          Date
          <br />
          <span className="font-medium">{currentDate}</span>
        </div>
        <div className="border border-gray-400 p-1">
          Report No.
          <br />
          <span className="font-medium">RPT-{elapsedDaysCalc}</span>
        </div>
        <div className="border border-gray-400 p-1">
          Month No.
          <br />
          <span className="font-medium">{currentMonth}</span>
        </div>
        <div className="border border-gray-400 p-1">
          Week No.
          <br />
          <span className="font-medium">Week-{weekno}</span>
        </div>
        <div className="border border-gray-400 p-1">
          Elapsed Days
          <br />
          <span className="font-medium">{elapsedDaysCalc}</span>
        </div>
        <div className="border rounded-r-md border-gray-400 p-1">
          Remaining Days
          <br />
          <span className="font-medium">{remainingDaysCalc}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
