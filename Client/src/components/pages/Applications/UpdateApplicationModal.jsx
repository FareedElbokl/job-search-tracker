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

const UpdateApplicationModal = (props) => {
  const [jobTitle, setJobTitle] = useState(props.application.job_title || "");
  const [companyName, setCompanyName] = useState(
    props.application.company_name || ""
  );
  const [dateApplied, setDateApplied] = useState(
    props.application.date_applied || null
  );
  const [status, setStatus] = useState(props.application.status_name || "");
  const [note, setNote] = useState(props.application.note || "");

  const handleSubmit = () => {
    props.updateApplication({
      jobTitle,
      companyName,
      dateApplied: dateApplied ? dateApplied.toISOString() : null,
      status,
      note,
    });
    props.closeModal();
  };

  if (!props.showModal) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      props.closeModal();
    }
  };

  return (
    <div className="update-modal-overlay" onClick={handleOverlayClick}>
      <div className="update-modal-container">
        <h2>Update Application</h2>
        <TextField
          label="Job Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <TextField
          label="Company Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Applied"
            value={dateApplied}
            onChange={(newValue) => setDateApplied(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
        </LocalizationProvider>
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value={"Applied"}>Applied</MenuItem>
            <MenuItem value={"Interview Scheduled"}>
              Interview Scheduled
            </MenuItem>
            <MenuItem value={"Accepted"}>Accepted</MenuItem>
            <MenuItem value={"Rejected"}>Rejected</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Note"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default UpdateApplicationModal;
