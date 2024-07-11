import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import validInfo from "../middleware/validInfo.js";
import jwtGenerator from "../utils/jwtGenerator.js";
import authorization from "../middleware/authorization.js";
import pool from "../db.js";

//REGISTER ROUTE
router.post("/register", validInfo, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //2. check if user alr exists (if so then throw an error)

    const userCheck = await pool.query("select * from Users where email = $1", [
      email,
    ]);

    if (userCheck.rows.length != 0) {
      //if true this means the user alr exists
      return res.status(401).send("user already exists."); //401 means user Unauthenticated, 403 means Unauthorized
    }

    //3. Bcrypt (hash) the user's password (bcrypt is a library used to hash passwords)

    const saltRounds = 10; //this is basically the number of times we are going to hash the inputted password.
    const salt = await bcrypt.genSalt(saltRounds);
    //genSalt(numRounds) generates a unique "salt" using specified num of rounds, ensuring no two passwords get hashed the same
    //a salt is random data added to the password

    const bcryptPassword = await bcrypt.hash(password, salt);
    //this will hash the password by combining it with the salt.

    //4. enter the new user inside our database

    const newUser = await pool.query(
      "insert into Users (username, email, password_hash) values ($1, $2, $3) returning*",
      [name, email, bcryptPassword] //make sure to use the bcryptPassword (hashed password)
    );

    //5. generating our jwt token

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
  }
});

//LOGIN ROUTE
router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body

    const { email, password } = req.body;

    //2. check if user doesnt exist (if they dont exist, throw error)

    const user = await pool.query("select * from Users where email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect."); //401=unauthenticated.
    }
    //3. check if inputted password is same as database password

    const validPasswordCheck = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPasswordCheck) {
      return res.status(401).json("Password or Email is incorrect.");
    }

    //4. give them the jwt token.

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
  }
});

//TOKEN VALIDATION
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
