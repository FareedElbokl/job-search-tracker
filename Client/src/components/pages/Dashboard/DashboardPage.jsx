import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import DashboardContent from "./DashboardContent";
import "./Dashboard.css";

const DashboardPage = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`app ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        isAuthenticated={props.isAuthenticated}
        setAuth={props.setAuth}
      ></Sidebar>
      <div className="content">
        <DashboardContent
          isAuthenticated={props.isAuthenticated}
        ></DashboardContent>
      </div>
    </div>
  );
};

export default DashboardPage;
