import React, { useState } from "react";
import { toast } from "react-toastify";
import "./Applications.css";

const Application = (props) => {
  const colorMapping = {
    Applied: "#ffeb3b",
    "Interview Scheduled": "#4caf50",
    Accepted: "#2196f3",
    Rejected: "#f44336",
  };

  async function updateButtonClicked() {
    props.setCurrApplicationToUpdate(props.application);
    props.setShowUpdateModal(true);
  }

  async function deleteApplication(applicationId) {
    if (props.isAuthenticated) {
      try {
        const url = `http://localhost:3000/applications/delete/${applicationId}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: { token: localStorage.getItem("token") },
        });
        if (!response.ok) {
          toast.error("Failed to delete application");
          return;
        }
        props.getUserApplications();
        toast.success("Application deleted successfully");
      } catch (error) {
        toast.error("An error occurred");
        console.error(error.message);
      }
    }
  }
  // Extract the date portion from the datetime string
  const formatDate = (dateString) => {
    return dateString.split("T")[0];
  };
  return (
    <div className="application">
      <h2>{props.application.job_title}</h2>
      <p>
        <strong>Company:</strong> {props.application.company_name}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: colorMapping[props.application.status_name] }}>
          {props.application.status_name}
        </span>
      </p>
      <p>
        <strong>Date Applied:</strong>{" "}
        {formatDate(props.application.date_applied)}
      </p>
      <p>
        <strong>Note:</strong>{" "}
        <span className="application-note">
          {props.application.note || "No notes available"}
        </span>
      </p>
      <div className="application-buttons">
        <button
          className="delete-application-btn"
          onClick={() => deleteApplication(props.application.application_id)}
        >
          Delete
        </button>
        <button
          className="update-application-btn"
          onClick={() => updateButtonClicked()}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Application;
