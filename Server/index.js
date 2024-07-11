import express from "express";
import cors from "cors";
import initDatabase from "./dbInit.js";
import router from "./routes/jwtAuth.js";

const app = express();
const port = 3000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES
//Authentication routes routes
app.use("/auth", router);
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
