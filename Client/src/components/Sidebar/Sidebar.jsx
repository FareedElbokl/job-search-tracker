import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Sidebar = (props) => {
  const location = useLocation();
  const activePage = location.pathname;
  return (
    <div className="sidebar">
      <button
        className="toggle-btn"
        onClick={() => {
          props.toggleSidebar();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon"
        >
          <path
            fillRule="evenodd"
            d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ul>
        <Link to="/" className={activePage === "/" ? "active" : ""}>
          <li>Dashboard</li>
        </Link>
        <Link
          to="/applications"
          className={activePage === "/applications" ? "active" : ""}
        >
          <li>View Job Applications</li>
        </Link>
        <Link
          to="/addApplication"
          className={activePage === "/addApplication" ? "active" : ""}
        >
          <li>Add Job Applications</li>
        </Link>
        {!props.isAuthenticated ? (
          <Link to="/login">
            <li>Sign in</li>
          </Link>
        ) : (
          <LogoutButton setAuth={props.setAuth}></LogoutButton>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
