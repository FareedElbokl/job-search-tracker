import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import AddApplicationsContent from "./AddApplicationsContent";

const AddApplicationsPage = (props) => {
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
        <AddApplicationsContent
          isAuthenticated={props.isAuthenticated}
        ></AddApplicationsContent>
      </div>
    </div>
  );
};

export default AddApplicationsPage;
