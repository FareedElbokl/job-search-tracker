CREATE DATABASE jobsearchtracker;

-- Users table
CREATE TABLE Users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ApplicationStatus table, stores different types of application status'
CREATE TABLE ApplicationStatus (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);

-- Insert default statuses
INSERT INTO ApplicationStatus (status_name) VALUES 
('Applied'), 
('Interview Scheduled'), 
('Accepted'), 
('Rejected');

-- Applications table
CREATE TABLE Applications (
    application_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(user_id) ON DELETE CASCADE,
    job_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    date_applied DATE NOT NULL,
    status_id INT REFERENCES ApplicationStatus(status_id),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_applications_user_id ON Applications(user_id);
CREATE INDEX idx_applications_status_id ON Applications(status_id);
CREATE INDEX idx_applications_job_title ON Applications(job_title);
CREATE INDEX idx_applications_company_name ON Applications(company_name);
