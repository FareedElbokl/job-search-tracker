// dbInit.js
import pool from "./db.js";

const createExtension = async () => {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log("UUID extension created successfully");
  } catch (err) {
    console.error("Error creating UUID extension", err);
  }
};

const createUsersTable = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("Users table created successfully");
  } catch (err) {
    console.error("Error creating Users table", err);
  }
};

const createApplicationStatusTable = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS ApplicationStatus (
                status_id SERIAL PRIMARY KEY,
                status_name VARCHAR(50) NOT NULL
            );
        `);
    console.log("ApplicationStatus table created successfully");
  } catch (err) {
    console.error("Error creating ApplicationStatus table", err);
  }
};

const createApplicationsTable = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS Applications (
                application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES Users(user_id) ON DELETE CASCADE,
                job_title VARCHAR(100) NOT NULL,
                company_name VARCHAR(100) NOT NULL,
                date_applied DATE NOT NULL,
                status_id INT REFERENCES ApplicationStatus(status_id),
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("Applications table created successfully");

    // Creating indexes
    await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_applications_user_id ON Applications(user_id);
            CREATE INDEX IF NOT EXISTS idx_applications_status_id ON Applications(status_id);
            CREATE INDEX IF NOT EXISTS idx_applications_job_title ON Applications(job_title);
            CREATE INDEX IF NOT EXISTS idx_applications_company_name ON Applications(company_name);
        `);
    console.log("Indexes created successfully for Applications table");
  } catch (err) {
    console.error("Error creating Applications table or indexes", err);
  }
};

const initDatabase = async () => {
  await createExtension();
  await createUsersTable();
  await createApplicationStatusTable();
  await createApplicationsTable();
};

export default initDatabase;
