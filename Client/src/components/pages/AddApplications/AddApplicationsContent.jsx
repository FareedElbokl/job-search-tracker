import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./AddApplications.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const AddApplicationsContent = (props) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [dateApplied, setDateApplied] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const statusMapping = {
    Applied: 1,
    "Interview Scheduled": 2,
    Accepted: 3,
    Rejected: 4,
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format("YYYY-MM-DD") : null;
  };

  async function handleSubmit() {
    //handle the api request when the create button is clicked here
    if (props.isAuthenticated) {
      if (!jobTitle || !dateApplied || !companyName) {
        toast.error(
          "Must specify company name, job title, and date applied before creating"
        );
        return;
      }
      const status_id = statusMapping[status];
      const body = {};
      if (jobTitle) body.job_title = jobTitle;
      if (companyName) body.company_name = companyName;
      if (dateApplied) body.date_applied = dateApplied;
      if (status_id) body.status_id = status_id;
      if (note) body.note = note;

      try {
        const url = "http://localhost:3000/applications/create";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          toast.error("Failed to create job application");
          return;
        }
        toast.success("Created job application successfully");
      } catch (error) {
        console.error(error.message);
      }
    } else {
      toast.error("Must be logged in to create job application");
    }
  }

  return (
    <div className="add-applications-container">
      <h2>Add New Job Application</h2>
      <TextField
        label="Job Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="add-application-input"
      />
      <TextField
        label="Company Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="add-application-input"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date Applied"
          value={dateApplied}
          onChange={(newValue) => setDateApplied(newValue)}
          textField={(params) => (
            <TextField {...params} fullWidth margin="normal" />
          )}
          className="add-application-input"
        />
      </LocalizationProvider>
      <FormControl fullWidth margin="normal" className="add-application-input">
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value={"Applied"}>Applied</MenuItem>
          <MenuItem value={"Interview Scheduled"}>Interview Scheduled</MenuItem>
          <MenuItem value={"Accepted"}>Accepted</MenuItem>
          <MenuItem value={"Rejected"}>Rejected</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Note"
        variant="outlined"
        fullWidth
        margin="normal"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="add-application-input"
      />
      <button className="submit-button" onClick={handleSubmit}>
        Create
      </button>
    </div>
  );
};

export default AddApplicationsContent;
