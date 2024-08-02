import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Application from "./Application";
import "./Applications.css";
import UpdateApplicationModal from "./UpdateApplicationModal";

const ApplicationsContent = (props) => {
  const [applications, setApplications] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currApplicationToUpdate, setCurrApplicationToUpdate] = useState({});

  const statusMapping = {
    Applied: 1,
    "Interview Scheduled": 2,
    Accepted: 3,
    Rejected: 4,
  };

  async function getUserApplications() {
    if (props.isAuthenticated) {
      try {
        const url = "http://localhost:3000/applications/all";
        const response = await fetch(url, {
          headers: { token: localStorage.getItem("token") },
        });
        if (!response.ok) {
          toast.error("Failed to retrieve user applications");
          return;
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        toast.error("An error occured");
        console.error(error.message);
      }
    }
  }

  async function updateApplication({
    jobTitle,
    companyName,
    dateApplied,
    status,
    note,
  }) {
    if (props.isAuthenticated) {
      try {
        const status_id = statusMapping[status];
        const body = {};
        if (jobTitle) body.job_title = jobTitle;
        if (companyName) body.company_name = companyName;
        if (dateApplied) body.date_applied = dateApplied;
        if (status_id) body.status_id = status_id;
        if (note) body.note = note;
        console.log(dateApplied);
        const url = `http://localhost:3000/applications/update/${currApplicationToUpdate.application_id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          toast.error("Failed to create category");
          return;
        }

        toast.success("Updated successfully");

        setCurrApplicationToUpdate((prev) => ({
          ...prev,
          ...(jobTitle && { job_title: jobTitle }),
          ...(companyName && { company_name: companyName }),
          ...(dateApplied && { date_applied: dateApplied }),
          ...(status_id && { status_id: status_id }),
          ...(note && { note: note }),
        }));

        getUserApplications();
      } catch (error) {
        console.error();
      }
    }
  }

  async function deleteAllUserApplications() {
    if (props.isAuthenticated) {
      try {
        const url = "http://localhost:3000/applications/all";
        const response = await fetch(url, {
          method: "DELETE",
          headers: { token: localStorage.getItem("token") },
        });
        if (!response.ok) {
          toast.error("Failed to delete all user applications");
          return;
        }
        getUserApplications();
        toast.success("All applications deleted successfully");
      } catch (error) {
        toast.error("An error occured");
        console.error(error.message);
      }
    }
  }

  useEffect(() => {
    getUserApplications();
  }, [props.isAuthenticated]);

  return (
    <div className="applications-container">
      <UpdateApplicationModal
        isAuthenticated={props.isAuthenticated}
        showModal={showUpdateModal}
        closeModal={() => {
          setShowUpdateModal(false);
        }}
        updateApplication={updateApplication}
        application={currApplicationToUpdate}
      />
      <div className="title-container">
        <h1>Job Applications</h1>
        {applications.length > 0 && (
          <button
            className="delete-all-btn"
            onClick={deleteAllUserApplications}
          >
            Delete All
          </button>
        )}
      </div>
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((application) => (
          <Application
            key={application.application_id}
            application={application}
            getUserApplications={getUserApplications}
            isAuthenticated={props.isAuthenticated}
            setCurrApplicationToUpdate={setCurrApplicationToUpdate}
            setShowUpdateModal={setShowUpdateModal}
          />
        ))
      )}
    </div>
  );
};

export default ApplicationsContent;
