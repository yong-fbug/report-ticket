import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import AOS from 'aos';
import "aos/dist/aos.css";
import HomePage from "./Pages/HomePage";
import { motion } from 'framer-motion';
import "./app.css";

// Register chart.js components and DataLabels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels, ArcElement);

const App = () => {
  const [reportData, setReportData] = useState([]);
  const [amPmChartData, setAmPmChartData] = useState({});
  const [techTicketChartData, setTechTicketChartData] = useState({});
  const [techPendingChartData, setTechPendingChartData] = useState({});
  const [statusChartData, setStatusChartData] = useState({});
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [summary, setSummary] = useState({});
  const [fileName, setFileName] = useState("No file chosen");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (isFileLoaded) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setCurrentDate(formattedDate);
    }
  }, [isFileLoaded]);

  const handlePrint = () => {
    window.print();
  };

  // Refs for the charts
  const amPmChartRef = useRef(null);
  const techTicketChartRef = useRef(null);
  const techPendingChartRef = useRef(null);
  const statusChartRef = useRef(null);

  // Function to process CSV and set data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed Data:", result.data);
          const processedData = result.data.map((row) => {
            const { STATUS: Status, "TICKET NUMBER": ticketID, "REQUEST EMAIL": requestEmail, DATE: Date, TIME: Time, SUBJECT: Subject, CATEGORY: Category, "SUB-CATEGORY": SubCategory, "Sub-Sub-Category": SubSubCategory, "ASSIGNED TECH SUPPORT": techNameAssigned } = row;
            return { Status, ticketID, requestEmail, Date, Time, Category, SubCategory, SubSubCategory, techNameAssigned };
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
      const timePeriod = item.Time.includes("AM") ? "AM" : "PM";
      acc[timePeriod] = (acc[timePeriod] || 0) + 1;
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

    const sortedTechTickets = Object.fromEntries(
      Object.entries(techTickets).sort(([, a], [, b]) => b - a)
    );

    const techTicketChart = {
      labels: Object.keys(sortedTechTickets),
      datasets: [
        {
          label: "Tickets Assigned to Tech",
          data: Object.values(sortedTechTickets),
          backgroundColor: "#FFCE56",
        },
      ],
    };

    // Most pending tickets by tech
    const techPendingTickets = data.reduce((acc, item) => {
      if (item.Status === "Open") {
        acc[item.techNameAssigned] = (acc[item.techNameAssigned] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedTechPendingTickets = Object.fromEntries(
      Object.entries(techPendingTickets).sort(([, a], [, b]) => b - a)
    );

    const techPendingChart = {
      labels: Object.keys(sortedTechPendingTickets),
      datasets: [
        {
          label: "Pending Tickets by Tech",
          data: Object.values(sortedTechPendingTickets),
          backgroundColor: ["#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#32a852"],
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
      sortedTechTickets,
      sortedTechPendingTickets,
      ticketStatusCount,
    });
  };

  return (
    <HomePage 
      currentDate={currentDate}
      isFileLoaded={isFileLoaded}
      handleFileUpload={handleFileUpload}
      fileName={fileName}
      reportData={reportData}
      summary={summary}
      amPmChartData={amPmChartData}
      techTicketChartData={techTicketChartData}
      techPendingChartData={techPendingChartData}
      statusChartData={statusChartData}
      amPmChartRef={amPmChartRef}
      techTicketChartRef={techTicketChartRef}
      techPendingChartRef={techPendingChartRef}
      statusChartRef={statusChartRef}
      handlePrint={handlePrint}
    />
  );
};

export default App;