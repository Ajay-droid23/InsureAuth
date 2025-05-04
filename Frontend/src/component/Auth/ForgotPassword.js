import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: request reset, 2: verify OTP, 3: set new password

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/request-password-reset', { email });
      setSuccess(response.data.message);
      setError("");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.error || "Error requesting password reset");
      setSuccess("");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-reset-otp', { email, otp });
      setSuccess(response.data.message);
      setError("");
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.error || "Error verifying OTP");
      setSuccess("");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/reset-password', { email, password });
      setSuccess(response.data.message);
      setError("");
      setTimeout(() => navigate("/loginn"), 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Error resetting password");
      setSuccess("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter OTP:</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn btn-primary">Reset Password</button>
          </form>
        )}

        <p className="mt-3">
          Remembered your password? <button onClick={() => navigate("/loginn")} className="btn btn-link">Log In</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;