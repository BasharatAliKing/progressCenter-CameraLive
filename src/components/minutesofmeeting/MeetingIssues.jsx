import React from "react";

const MeetingIssues = () => {
  return (
    <table className="w-full border-collapse border border-black">
      <thead>
        <tr>
          <th className="border border-black p-2 w-[50px] whitespace-nowrap">Sr. No.</th>
          <th className="border border-black p-2">Agenda</th>
          <th className="border border-black p-2">Discussion/ Decision</th>
          <th className="border border-black p-2 whitespace-nowrap">Current Status</th>
          <th className="border border-black p-2 whitespace-nowrap">Action Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-black p-2 text-center max-w-[30px]">
            1.
          </td>
          <td className="border border-black p-2">
            <b>Submission of HSE Plan</b> <br />
            NESPAK advised contractor to submit the HSE plan according to the
            19.3 clause within 14 days after commencement date.
          </td>
          <td className="border border-black p-2">
            <b>15th Jan’26: </b> <br />
            MS/Contractor FWO & ZKB has confirmed HSE plan will be submitted by
            20th Jan’2026
          </td>
          <td className="border border-black p-2 text-center">Open</td>
          <td className="border border-black p-2 text-center">31th Feb, 2026</td>
        </tr>
      </tbody>
    </table>
  );
};

export default MeetingIssues;
