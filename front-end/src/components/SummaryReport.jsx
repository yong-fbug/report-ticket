import React from 'react';

const Summary = ({ summary }) => (
  <div className="mb-6"
    data-aos="fade-right"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
  >
    <div className='absolute '>
      <h2 className="text-2xl font-semibold mb-4">Summary</h2>
      <ul className="list-disc pl-6">
        <li>Total Tickets: {summary.totalTickets}</li>
        <li>AM Tickets: {summary.timeOfDay["AM"] || 0}</li>
        <li>PM Tickets: {summary.timeOfDay["PM"] || 0}</li>
      </ul>
    </div>

      <div className='flex center justify-center space-x-6 pt-40'>
      <p className='text-lg'>
      <p className='uppercase font-semibold text-lg font-mono'>Pending Tickets:</p>
          
          <table className="table-auto mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2">Tech</th>
                <th className="px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.sortedTechTickets).map(([tech, count]) => (
                <tr key={tech}>
                  <td className="border px-4 py-2">{tech}</td>
                  <td className="border px-4 py-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </p>
        <p className='text-lg'>
        <p className='uppercase font-semibold text-lg font-mono'>Pending Tickets:</p>
          <table className="table-auto mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2">Tech</th>
                <th className="px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.sortedTechPendingTickets).map(([tech, count]) => (
                <tr key={tech}>
                  <td className="border px-4 py-2">{tech}</td>
                  <td className="border px-4 py-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </p>
        </div>
      
    
  </div>
);

export default Summary;