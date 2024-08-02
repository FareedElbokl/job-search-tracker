import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.css";
import { toast } from "react-toastify";

const Chart = (props) => {
  const [reportData, setReportData] = useState([]);

  async function getReportData() {
    if (props.isAuthenticated) {
      try {
        const url = "http://localhost:3000/dashboard/applications-per-month";
        const response = await fetch(url, {
          headers: { token: localStorage.getItem("token") },
        });
        if (!response.ok) {
          toast.error("Error occured");
          return;
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  useEffect(() => {
    getReportData();
  });

  return (
    <div className="chart-container">
      <LineChart width={700} height={300} data={reportData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Applied" stroke="#388e3c" />
        <Line type="monotone" dataKey="Interview Scheduled" stroke="#fbc02d" />
        <Line type="monotone" dataKey="Accepted" stroke="#1976d2" />
        <Line type="monotone" dataKey="Rejected" stroke="#d32f2f" />
      </LineChart>
    </div>
  );
};

export default Chart;
