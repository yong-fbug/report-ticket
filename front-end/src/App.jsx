import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas"; 

// Register chart.js components and DataLabels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const App = () => {
  const [reportData, setReportData] = useState([]);
  const [amPmChartData, setAmPmChartData] = useState({});
  const [techTicketChartData, setTechTicketChartData] = useState({});
  const [techPendingChartData, setTechPendingChartData] = useState({});
  const [statusChartData, setStatusChartData] = useState({});
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [summary, setSummary] = useState({});
  
  // Refs for the charts
  const amPmChartRef = useRef(null);
  const techTicketChartRef = useRef(null);
  const techPendingChartRef = useRef(null);
  const statusChartRef = useRef(null);

  // Function to process CSV and set data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed Data:", result.data);
          const processedData = result.data.map((row) => {
            const { Status, "Ticket ID": ticketID, Category, Date, Time, "Tech Name Assigned": techNameAssigned, Pending } = row;
            return { Status, ticketID, Category, Date, Time, techNameAssigned, Pending };
          });
          setReportData(processedData);
          setIsFileLoaded(true);
          generateSummary(processedData);
        },
        header: true, // Treat the first row as header
      });
    }
  };

  // Generate summary data and charts
  const generateSummary = (data) => {
    const totalTickets = data.length;

    // AM vs PM tickets
    const timeOfDay = data.reduce((acc, item) => {
      acc[item.Time] = (acc[item.Time] || 0) + 1;
      return acc;
    }, {});

    const amPmChart = {
      labels: ["AM", "PM"],
      datasets: [
        {
          label: "Tickets by Time of Day",
          data: [timeOfDay["AM"] || 0, timeOfDay["PM"] || 0],
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    };

    // Most tickets assigned to a tech
    const techTickets = data.reduce((acc, item) => {
      acc[item.techNameAssigned] = (acc[item.techNameAssigned] || 0) + 1;
      return acc;
    }, {});

    const techTicketChart = {
      labels: Object.keys(techTickets),
      datasets: [
        {
          label: "Tickets Assigned to Tech",
          data: Object.values(techTickets),
          backgroundColor: "#FFCE56",
        },
      ],
    };

    // Most pending tickets by tech
    const techPendingTickets = data.reduce((acc, item) => {
      if (item.Pending === "Yes") {
        acc[item.techNameAssigned] = (acc[item.techNameAssigned] || 0) + 1;
      }
      return acc;
    }, {});

    const techPendingChart = {
      labels: Object.keys(techPendingTickets),
      datasets: [
        {
          label: "Pending Tickets by Tech",
          data: Object.values(techPendingTickets),
          backgroundColor: "#FF9F40",
        },
      ],
    };

    // Pending and Closed tickets
    const ticketStatusCount = data.reduce((acc, item) => {
      if (item.Status === "Open") {
        acc.open = (acc.open || 0) + 1;
      } else if (item.Status === "Closed") {
        acc.closed = (acc.closed || 0) + 1;
      }
      return acc;
    }, {});

    const statusChart = {
      labels: ["Open", "Closed"],
      datasets: [
        {
          label: "Ticket Status",
          data: [ticketStatusCount.open, ticketStatusCount.closed],
          backgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };

    setAmPmChartData(amPmChart);
    setTechTicketChartData(techTicketChart);
    setTechPendingChartData(techPendingChart);
    setStatusChartData(statusChart);
    setSummary({
      totalTickets,
      timeOfDay,
      techTickets,
      techPendingTickets,
      ticketStatusCount,
    });
  };

  const downloadWordReport = () => {
    const tableData = reportData.map((row) => [
      row.ticketID, row.Status, row.Category, row.Date, row.Time, row.techNameAssigned, row.Pending,
    ]);
  
    // Capture chart images using html2canvas
    const chartRefs = [
      amPmChartRef,
      techTicketChartRef,
      techPendingChartRef,
      statusChartRef
    ];
  
    // Use a Promise to ensure that all charts are captured
    Promise.all(
      chartRefs.map((chartRef) =>
        html2canvas(chartRef.current).then((canvas) => canvas.toDataURL("image/png"))
      )
    ).then((images) => {
      const content = `
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:body>
            <w:p><w:r><w:t>Ticket Report</w:t></w:r></w:p>
            <w:tbl>
              <w:tr>
                <w:tc><w:p><w:r><w:t>Ticket ID</w:t></w:r></w:p></w:tc>
                <w:tc><w:p><w:r><w:t>Status</w:t></w:r></w:p></w:tc>
                <w:tc><w:p><w:r><w:t>Category</w:t></w:r></w:p></w:tc>
                <w:tc><w:p><w:r><w:t>Date</w:t></w:r></w:p></w:tc>
                <w:tc><w:p><w:r><w:t>Time</w:t></w:r></w:p></w:tc>
                <w:tc><w:p><w:r><w:t>Tech Name Assigned</w:t></w:r></w:p></w:tc>
                <w:tc><w:p><w:r><w:t>Pending</w:t></w:r></w:p></w:tc>
              </w:tr>
              ${tableData
                .map(
                  (row) => `
                    <w:tr>
                      ${row
                        .map(
                          (cell) => `
                            <w:tc><w:p><w:r><w:t>${cell}</w:t></w:r></w:p></w:tc>
                          `
                        )
                        .join("")}
                    </w:tr>
                  `
                )
                .join("")}
            </w:tbl>
            ${images
              .map(
                (image, index) => `
                <w:p><w:r><w:t>Chart ${index + 1}</w:t></w:r></w:p>
                <w:p><w:r><w:pict><w:binData><w:base64>${image.split(",")[1]}</w:base64></w:binData></w:pict></w:r></w:p>
              `
              )
              .join("")}
          </w:body>
        </w:document>
      `;
  
      const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      saveAs(blob, "report.docx");
    });
  };
  

  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Report Dashboard</h1>

        {/* File Upload */}
        <div className="flex justify-center mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          />
        </div>

        {/* Table */}
        {isFileLoaded && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ticket Report</h2>
            <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Ticket ID</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Tech Name Assigned</th>
                  <th className="py-2 px-4 text-left">Pending</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{row.ticketID}</td>
                    <td className="py-2 px-4">{row.Status}</td>
                    <td className="py-2 px-4">{row.Category}</td>
                    <td className="py-2 px-4">{row.Date}</td>
                    <td className="py-2 px-4">{row.Time}</td>
                    <td className="py-2 px-4">{row.techNameAssigned}</td>
                    <td className="py-2 px-4">{row.Pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {isFileLoaded && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <ul className="list-disc pl-6">
              <li>Total Tickets: {summary.totalTickets}</li>
              <li>AM Tickets: {summary.timeOfDay["AM"] || 0}</li>
              <li>PM Tickets: {summary.timeOfDay["PM"] || 0}</li>
              <li>Most Tickets Assigned: {Object.entries(summary.techTickets).map(([tech, count]) => `${tech}: ${count}`).join(", ")}</li>
              <li>Pending Tickets: {Object.entries(summary.techPendingTickets).map(([tech, count]) => `${tech}: ${count}`).join(", ")}</li>
            </ul>
          </div>
        )}

        {/* Charts */}
        {isFileLoaded && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Charts</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Tickets by Time of Day</h3>
                <div ref={amPmChartRef}>
                  <Bar data={amPmChartData} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tickets Assigned to Tech</h3>
                <div ref={techTicketChartRef}>
                  <Bar data={techTicketChartData} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pending Tickets by Tech</h3>
                <div ref={techPendingChartRef}>
                  <Bar data={techPendingChartData} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ticket Status</h3>
                <div ref={statusChartRef}>
                  <Bar data={statusChartData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="flex justify-center">
          <button
            onClick={downloadWordReport}
            className="px-6 py-2 bg-green-500 text-white rounded-md shadow-md"
          >
            Download Report as Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
