import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";

const Data = (props) => {
  const [data, setData] = useState({
    pending_applications: 0,
    interviews_scheduled: 0,
    accepted: 0,
    rejected: 0,
  });

  async function getDashboardData() {
    if (props.isAuthenticated) {
      try {
        const url = "http://localhost:3000/dashboard/data";
        console.log("making request");
        const response = await fetch(url, {
          headers: { token: localStorage.getItem("token") },
        });
        if (!response.ok) {
          toast.error("An error occured");
          return;
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        toast.error("Error occured");
        console.error(error.message);
      }
    }
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="data-container">
      <div className="data-square applied">
        <h3>Applied</h3>
        <p>{data.pending_applications}</p>
      </div>
      <div className="data-square interview-scheduled">
        <h3>Interview Scheduled</h3>
        <p>{data.interviews_scheduled}</p>
      </div>
      <div className="data-square accepted">
        <h3>Accepted</h3>
        <p>{data.accepted}</p>
      </div>
      <div className="data-square rejected">
        <h3>Rejected</h3>
        <p>{data.rejected}</p>
      </div>
    </div>
  );
};

export default Data;
