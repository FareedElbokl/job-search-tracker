import React from "react";
import Data from "./Data";
import Chart from "./Chart";
import "./Dashboard.css";

const DashboardContent = (props) => {
  return (
    <div className="dashboard-content">
      <div className="title-dashboard-container">
        <h1>Dashboard</h1>
      </div>

      <Data isAuthenticated={props.isAuthenticated} />
      <Chart isAuthenticated={props.isAuthenticated} />
    </div>
  );
};

export default DashboardContent;
