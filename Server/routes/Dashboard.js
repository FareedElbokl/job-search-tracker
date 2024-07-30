import express from "express";
const routerDashboard = express.Router();
import pool from "../db.js";
import authorization from "../middleware/authorization.js";

//GET DASHBOARD DATA (# of pending applications, interviews scheduled, accepted, rejected for a user):
routerDashboard.get("/data", authorization, async (req, res) => {
  try {
    //1 Get hold of user id from auth middleware
    const user_id = req.user;

    // 2. Query the database to get counts for each status
    const query = `
    SELECT
      SUM(CASE WHEN a.status_id = (SELECT status_id FROM ApplicationStatus WHERE status_name = 'Applied') THEN 1 ELSE 0 END) AS pending_applications,
      SUM(CASE WHEN a.status_id = (SELECT status_id FROM ApplicationStatus WHERE status_name = 'Interview Scheduled') THEN 1 ELSE 0 END) AS interviews_scheduled,
      SUM(CASE WHEN a.status_id = (SELECT status_id FROM ApplicationStatus WHERE status_name = 'Accepted') THEN 1 ELSE 0 END) AS accepted,
      SUM(CASE WHEN a.status_id = (SELECT status_id FROM ApplicationStatus WHERE status_name = 'Rejected') THEN 1 ELSE 0 END) AS rejected
    FROM Applications a
    WHERE a.user_id = $1;
  `;

    const result = await pool.query(query, [user_id]);

    // 3. Send the result back to the client
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//GET number of applications for each of the past 3 months
routerDashboard.get(
  "/applications-per-month",
  authorization,
  async (req, res) => {
    try {
      //user id
      const user_id = req.user;

      //2 sql query
      const query = `WITH DateRange AS (
  SELECT
    CURRENT_DATE - INTERVAL '2 months' AS start_date,
    CURRENT_DATE AS end_date
),
MonthSeries AS (
  SELECT
    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months') AS month
  UNION ALL
  SELECT
    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  UNION ALL
  SELECT
    DATE_TRUNC('month', CURRENT_DATE)
),
MonthlyApplications AS (
  SELECT
    DATE_TRUNC('month', a.date_applied) AS month,
    s.status_name,
    COUNT(*) AS count
  FROM Applications a
  JOIN ApplicationStatus s ON a.status_id = s.status_id
  WHERE a.user_id = $1
    AND a.date_applied >= (SELECT start_date FROM DateRange)
    AND a.date_applied < (SELECT end_date FROM DateRange) + INTERVAL '1 month'
  GROUP BY DATE_TRUNC('month', a.date_applied), s.status_name
),
Pivot AS (
  SELECT
    ms.month,
    COALESCE(SUM(CASE WHEN ma.status_name = 'Applied' THEN ma.count ELSE 0 END), 0) AS "Applied",
    COALESCE(SUM(CASE WHEN ma.status_name = 'Interview Scheduled' THEN ma.count ELSE 0 END), 0) AS "Interview Scheduled",
    COALESCE(SUM(CASE WHEN ma.status_name = 'Accepted' THEN ma.count ELSE 0 END), 0) AS "Accepted",
    COALESCE(SUM(CASE WHEN ma.status_name = 'Rejected' THEN ma.count ELSE 0 END), 0) AS "Rejected"
  FROM MonthSeries ms
  LEFT JOIN MonthlyApplications ma ON ms.month = ma.month
  GROUP BY ms.month
)
SELECT
  TO_CHAR(month, 'YYYY-MM') AS "name",
  "Applied",
  "Interview Scheduled",
  "Accepted",
  "Rejected"
FROM Pivot
ORDER BY month;
`;

      const result = await pool.query(query, [user_id]);

      // 3. Send the result back to the client
      res.json(result.rows);
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send("Server error when retrieving applications per month.");
    }
  }
);

export default routerDashboard;
