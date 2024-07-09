import express from "express";
import cors from "cors";
import initDatabase from "./dbInit.js";

const app = express();
const port = 3000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//test route
app.get("/api", (req, res) => res.send("Hello World!"));

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize database", err);
    process.exit(1);
  }
};

startServer();
