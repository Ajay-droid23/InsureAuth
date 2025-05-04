import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import './Auth.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // In Login.js, modify the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { role, user, token } = response.data;
  
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token); // Store the JWT token
  
      if (role === "admin") {
        navigate("/admin");
        window.alert("Logged in as admin");
      } else if (role === "agent") {
        navigate("/agent");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      setError("Invalid email or password.");
    }
  };
  
  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <Link className="bk btn-primary" to="/signupp">Back</Link>
      </div>
      <div className="auth-container d-flex" style={{ marginTop: "-45px" }}>
        <div className="auth-box login-form">
                 {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
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
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="mb-3 text-muted">
              Forgot your password? <span onClick={() => navigate("/forgot-password")} className="text-primary" style={{ cursor: "pointer" }}>Reset Password</span>
            </p>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <p className="mt-3 text-muted text-center">
            Don't have an account? <span onClick={() => navigate("/signupp")} className="text-primary" style={{ cursor: "pointer" }}>Sign Up</span>
          </p>
        </div>
        <div className="img-hid">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/car-insurance-9848657-7994011.png?f=webp" alt="Car Insurance"/>
        </div>
      </div>
    </div>
  );
};

export default Login;
