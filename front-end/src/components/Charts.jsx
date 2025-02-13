import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const Charts = ({ amPmChartData, techTicketChartData, techPendingChartData, statusChartData, amPmChartRef, techTicketChartRef, techPendingChartRef, statusChartRef, width, height }) => (
  <div className="mb-6">
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Charts</h2>
    </motion.div>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Tickets by Time of Day</h3>
        <div ref={amPmChartRef} style={{ width, height }}>
          <Pie data={amPmChartData} options={{ plugins: { datalabels: { font: { weight: 'bold' } } } }} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Tickets Assigned to Tech</h3>
        <div ref={techTicketChartRef}>
          <Bar data={techTicketChartData} options={{ plugins: { datalabels: { font: { weight: 'bold' } } } }} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Pending Tickets by Tech</h3>
        <div ref={techPendingChartRef} style={{ width, height }}>
          <Pie data={techPendingChartData} options={{ plugins: { datalabels: { font: { weight: 'bold' } } } }} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Ticket Status</h3>
        <div ref={statusChartRef} style={{ width, height }}>
          <Pie data={statusChartData} options={{ plugins: { datalabels: { font: { weight: 'bold' } } } }} />
        </div>
      </div>
    </div>
  </div>
);

export default Charts;