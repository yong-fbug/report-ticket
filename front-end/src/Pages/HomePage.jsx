import React from 'react';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import TicketTable from '../components/TicketTable';
import Summary from '../components/SummaryReport';
import Charts from '../components/Charts';
import { motion } from 'framer-motion';

const HomePage = ({ currentDate, isFileLoaded, handleFileUpload, fileName, reportData, summary, amPmChartData, techTicketChartData, techPendingChartData, statusChartData, amPmChartRef, techTicketChartRef, techPendingChartRef, statusChartRef, handlePrint }) => (
  <div className="min-h-screen bg-white p-8">
    <div className="max-w-7xl mx-auto rounded-lg shadow-lg p-6">
      <Header currentDate={currentDate} isFileLoaded={isFileLoaded} />
      {!isFileLoaded && <FileUpload handleFileUpload={handleFileUpload} fileName={fileName} />}
     
      {isFileLoaded && <Summary summary={summary} />}

      {isFileLoaded && (<hr className='pb-20'></hr>)}

      {isFileLoaded && <Charts 
        amPmChartData={amPmChartData} 
        techTicketChartData={techTicketChartData} 
        techPendingChartData={techPendingChartData} 
        statusChartData={statusChartData} 
        amPmChartRef={amPmChartRef} 
        techTicketChartRef={techTicketChartRef} 
        techPendingChartRef={techPendingChartRef} 
        statusChartRef={statusChartRef} 
        width="50%"
        height="100%"
      />}
      {isFileLoaded && (
        <div className="flex justify-center mt-4 gap-4">
          <motion.button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Download
          </motion.button>
        </div>
      )}
       {isFileLoaded && <TicketTable reportData={reportData} />}
    </div>
  </div>
);

export default HomePage;