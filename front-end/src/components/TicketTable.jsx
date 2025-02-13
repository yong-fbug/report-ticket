import React from 'react';
import '../app.css'

const TicketTable = ({ reportData }) => (
  <div className="mb-6 w-full">
    <h2 
      className="text-2xl font-semibold mb-4"
      data-aos="fade-right"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
    >
      Ticket Report
    </h2>
    <div className="w-full overflow-x-auto overflow-y-auto">
      <table 
          className="w-full overflow-auto min-w-full whitespace-nowrap 
          table-auto border-collapse bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          
          <tr>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Ticket ID</th>
            <th className="py-2 px-4 text-left">Request Email</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Time</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Sub-Category</th>
            <th className="py-2 px-4 text-left">Sub-Sub-Category</th>
            <th className="py-2 px-4 text-left">Tech Name Assigned</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{row.Status}</td>
              <td className="py-2 px-4">{row.ticketID}</td>
              <td className="py-2 px-4">{row.requestEmail}</td>
              <td className="py-2 px-4">{row.Date}</td>
              <td className="py-2 px-4">{row.Time}</td>
              <td className="py-2 px-4">{row.Category}</td>
              <td className="py-2 px-4">{row.SubCategory}</td>
              <td className="py-2 px-4">{row.SubSubCategory}</td>
              <td className="py-2 px-4">{row.techNameAssigned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TicketTable;