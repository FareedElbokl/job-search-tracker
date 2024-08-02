import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import ApplicationsContent from "./ApplicationsContent";
import "./Applications.css";

const ApplicationsPage = (props) => {
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
        <ApplicationsContent
          isAuthenticated={props.isAuthenticated}
        ></ApplicationsContent>
      </div>
    </div>
  );
};

export default ApplicationsPage;
