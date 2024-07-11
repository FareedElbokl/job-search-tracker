import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

//this function will generate a jwt token for the user. Think of it as a wristband from the bar example.
function jwtGenerator(user_id) {
  //each token given to a user has a payload (data) and it has to be signed so we know its authentic
  const payload = {
    user: user_id,
  };

  //Sign the token
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "2hr" }); //the expiry is measured in seconds, but u can also just say "1hr" as a string
}

export default jwtGenerator;
