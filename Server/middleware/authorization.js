import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//this checks if a token is valid or not

export default async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload.user;

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not Authroized");
  }
};
