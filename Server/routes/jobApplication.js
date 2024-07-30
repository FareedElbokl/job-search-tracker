import express from "express";
const routerApplication = express.Router();
import pool from "../db.js";
import authorization from "../middleware/authorization.js";

//get user id from token which is passed in with request

//GET ALL APPLICATIONS
routerApplication.get("/all", authorization, async (req, res) => {
  try {
    //1 Get hold of user id from auth middleware
    const user_id = req.user;

    // 2. Query the database for all applications of the current user
    const query = `
    SELECT
      a.application_id,
      a.job_title,
      a.company_name,
      a.date_applied,
      s.status_name,
      a.note,
      a.created_at,
      a.updated_at
    FROM Applications a
    JOIN ApplicationStatus s ON a.status_id = s.status_id
    WHERE a.user_id = $1
    ORDER BY a.date_applied DESC;
  `;
    const result = await pool.query(query, [user_id]);

    // 3. Send the result back to the client
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error when retreiving all applications.");
  }
});

//CREATE AN APPLICATION
routerApplication.post("/create", authorization, async (req, res) => {
  try {
    //1 Get hold of user id from auth middleware, and task description from the body
    const user_id = req.user;
    console.log(user_id);

    //2 Get task description from body
    const { job_title, company_name, date_applied, status_id, note } = req.body;

    // 3. Insert the new application into the database
    const query = `
    INSERT INTO Applications (user_id, job_title, company_name, date_applied, status_id, note)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
    const values = [
      user_id,
      job_title,
      company_name,
      date_applied,
      status_id,
      note,
    ];
    const result = await pool.query(query, values);

    // 4. Send the newly created application back to the client
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//UPDATE AN APPLICATION
routerApplication.put(
  "/update/:applicationId",
  authorization,
  async (req, res) => {
    try {
      //1 get hold of user id from auth middleware and application id from params
      const user_id = req.user;
      const { applicationId } = req.params;
      const { job_title, company_name, date_applied, status_id, note } =
        req.body;

      // 3. Update the application in the database
      const query = `
    UPDATE Applications
    SET
      job_title = COALESCE($1, job_title),
      company_name = COALESCE($2, company_name),
      date_applied = COALESCE($3, date_applied),
      status_id = COALESCE($4, status_id),
      note = COALESCE($5, note),
      updated_at = CURRENT_TIMESTAMP
    WHERE application_id = $6 AND user_id = $7
    RETURNING *;
  `;

      const values = [
        job_title,
        company_name,
        date_applied,
        status_id,
        note,
        applicationId,
        user_id,
      ];

      const result = await pool.query(query, values);

      // 4. Check if the application was updated and return the updated application
      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Application cannot be updated, not found or not authorized",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error.message);
    }
  }
);

//DELETE AN APPLICATION
routerApplication.delete(
  "/delete/:applicationId",
  authorization,
  async (req, res) => {
    try {
      //1 get hold of user id from auth middleware and application id from params
      const user_id = req.user;
      const { applicationId } = req.params;

      // 2. Delete the application from the database
      const query = `
    DELETE FROM Applications
    WHERE application_id = $1 AND user_id = $2
    RETURNING *;
  `;

      const result = await pool.query(query, [applicationId, user_id]);

      // 3. Check if the application was deleted
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Application not found or not authorized" });
      }

      // 4. Send a success message
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error(error.message);
    }
  }
);

//DELETE ALL APPLICATIONS
routerApplication.delete("/all", authorization, async (req, res) => {
  try {
    console.log("here");
    //1 get user id
    const user_id = req.user;

    // 2. Delete all applications for the specific user
    const query = `
      DELETE FROM Applications
      WHERE user_id = $1;
    `;

    const result = await pool.query(query, [user_id]);

    // 3. Check if any rows were deleted and send an appropriate response
    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: `Deleted ${result.rowCount} application(s).` });
    } else {
      res.status(404).json({ message: "No applications found for this user." });
    }
  } catch (error) {
    console.error(error.message);
  }
});

export default routerApplication;
