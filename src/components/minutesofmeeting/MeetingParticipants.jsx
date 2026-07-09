import React from 'react'

const MeetingParticipants = () => {
  return (
      <table className="w-full border-collapse border border-black">
        <thead>
            <tr>
              <th className="border border-black p-2 max-w-[30px]">Sr. No.</th>
              <th className="border border-black p-2">Name</th>
              <th className="border border-black p-2">Company</th>
              <th className="border border-black p-2 ">Designation</th>
            </tr>
        </thead>
        <tbody>
             <tr>
               <td className="border border-black p-2 text-center max-w-[30px]">1.</td>
               <td className="border border-black p-2">John Doe</td>
               <td className="border border-black p-2 text-center">NESPAK</td>
               <td className="border border-black p-2">Project Manager</td>
             </tr>
             <tr>
               <td className="border border-black p-2 text-center max-w-[30px]">1.</td>
               <td className="border border-black p-2">John Doe</td>
               <td className="border border-black p-2 text-center">NESPAK</td>
               <td className="border border-black p-2">Project Manager</td>
             </tr>
             <tr>
               <td className="border border-black p-2 text-center max-w-[30px]">1.</td>
               <td className="border border-black p-2">John Doe</td>
               <td className="border border-black p-2 text-center">NESPAK</td>
               <td className="border border-black p-2">Project Manager</td>
             </tr>
        </tbody>
      </table>
  )
}

export default MeetingParticipants
