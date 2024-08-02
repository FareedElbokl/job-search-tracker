import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Registration.css";

const Registration = (props) => {
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
  });
  const { email, name, password } = inputs;
  const navigate = useNavigate();

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  async function onSubmitForm(e) {
    e.preventDefault();
    try {
      const body = { email, password, name };
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        toast.error("User Already Exists");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        toast.error("Registration Failed");
        return;
      }
      const parseRes = await response.json(); //this is where the jwt token is stored

      //now we want to store the jwt token in local storage
      localStorage.setItem("token", parseRes.token);

      //now change the auth state
      toast.success("Successfully registered");
      props.setAuth(true);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={onSubmitForm}>
        <h2 className="registration-title">Register</h2>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="registration-button">
          Register
        </button>
        <div className="links">
          <Link to="/login" className="login-link">
            Login
          </Link>
          <Link to="/" className="home-link">
            Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;
