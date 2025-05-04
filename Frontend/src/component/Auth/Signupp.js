import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import './Auth.css';
import { set } from "mongoose";

function Signupp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    role: "customer",
    password: "",
    confirmPassword: "",
    adminCode: "",
    otp: ""
  });

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const allFieldsFilled = () =>
    user.name && user.email && user.vehicleno && user.gender &&
    user.role && user.password && user.confirmPassword &&
    (user.role !== "admin" || user.adminCode === "insadmin");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    if (!allFieldsFilled()) {
      setError("All fields are required.");
      return;
    }
  
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { 
        email: user.email 
      });
      console.log(response.data);
      setOtpSent(true);
      setSuccess("OTP sent successfully.");
      setError(""); // Clear any previous errors
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError("User already exists or error sending otp");
      } else {
        setError("Error sending OTP");
      }
    }finally{
      setLoading(false); // Stop loading state
    }
  };

  const handleVerifyOtp = async () => {
   
    // if (!otpVerified) {
    //   setError("Please verify OTP before signing up.");
    //   return;
    // }
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email: user.email,
        otp: user.otp
      });
      console.log(response.data);
      setOtpVerified(true);
    } catch (error) {
      setError("Invalid or expired OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allFieldsFilled()) {
      setError("All fields are required.");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (user.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!otpVerified) {
      setError("Please verify OTP before signing up.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/signup', user);
      navigate("/loginn");
    } catch (error) {
      setError("Error submitting form");
    }
  };

  return (
    <div>
      <div style={{ marginTop: '26px' }}>
        <Link className="bk btn-primary" to="/">Back</Link>
      </div>
      <div className="auth-container d-flex" style={{ height: '200vh', marginTop: '-200px' }}>
        <div className="auth-box signup-form">
          <h2 style={{ textAlign: "center" }}>Register</h2>
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><input type="text" name="name" className="form-control" placeholder="Name" onChange={handleChange} /></div>
            <div className="form-group"><input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} /></div>
            <div className="form-group"><input type="text" name="vehicleno" className="form-control" placeholder="Vehicle Reg no" onChange={handleChange} /></div>
            <div className="form-group">
              <select name="gender" className="form-control" onChange={handleChange}>
                <option value="">--Select Gender--</option>
                <option value="male">Male</option><option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <select name="role" className="form-control" onChange={handleChange}>
                <option value="">--Select Role--</option>
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </div>
            {user.role === "admin" && (
              <div className="form-group">
                <input type="text" name="adminCode" className="form-control" placeholder="Admin Code" onChange={handleChange} />
              </div>
            )}
            <div className="form-group"><input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} /></div>
            <div className="form-group"><input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" onChange={handleChange} /></div>

            {!otpSent && (
              <button type="button" className="btn btn-primary w-100" onClick={handleSendOtp} disabled={!allFieldsFilled()}>{loading ? 'Sending...' : 'Send OTP'}</button>
            )}

            {otpSent && (
              <>
                <div className="form-group">
                  <input type="text" name="otp" className="form-control" placeholder="Enter OTP" onChange={handleChange} />
                  <button type="button"  className="btn btn-success w-100 mt-4" disabled={otpVerified} onClick={handleVerifyOtp}>{otpVerified ? 'Verified' : 'Verify OTP'}</button>
                </div>
              </>
            )}

            <button className="btn btn-primary w-100 mt-2" type="submit" style={{ backgroundColor: otpVerified ? '#007bff' : 'grey' }} disabled={!otpVerified }>Sign Up</button>
          </form>
          <p className="mt-3 text-muted">
            Already have an account? <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/loginn")}>Log In</span>
          </p>
        </div>
        <div className="img-hid">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/car-insurance-9476436-7767110.png" alt="Car Insurance" />
        </div>
      </div>
    </div>
  );
}

export default Signupp;


