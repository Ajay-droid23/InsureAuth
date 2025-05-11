import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  InputGroup,
  ProgressBar,
  Spinner 
} from 'react-bootstrap';
import { 
  FaUser, 
  FaEnvelope, 
  FaVenusMars, 
  FaUserTag, 
  FaLock, 
  FaCheckCircle, 
  FaShieldAlt,
  FaKey,
  FaUserPlus,
} from 'react-icons/fa';
import './signup.css';

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
    otp: ""
  });

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Password strength logic
  useEffect(() => {
    let strength = 0;
    
    if (user.password.length > 0) strength += 1;
    if (user.password.length >= 6) strength += 1;
    if (/[A-Z]/.test(user.password)) strength += 1;
    if (/[0-9]/.test(user.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(user.password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [user.password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "danger";
    if (passwordStrength <= 3) return "warning";
    return "success";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  //all fields filled in each step logic
  const allFieldsFilled = () => {
    if (step === 1) {
      return user.name && user.email  && user.gender && user.role;
    } else if (step === 2) {
      return user.password && user.confirmPassword;
    }
    return false;
  };

  //sets the state variable with form details logic
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError("");
  };

  //send otp logic
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!allFieldsFilled()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
  
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/auth/send-otp', { 
        email: user.email 
      });
      setOtpSent(true);
      setSuccess("OTP sent successfully to your email.");
      setError("");
      startTimer();
      setStep(3);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError("User already exists or error sending OTP");
      } else {
        setError("Error sending OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  //resend otp logic
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/auth/resend-otp', { 
        email: user.email 
      });
      setSuccess("OTP resent successfully to your email.");
      setError("");
      startTimer();
    } catch (error) {
      setError("Error resending OTP. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  //verify otp logic
  const handleVerifyOtp = async () => {
    if (!user.otp) {
      setError("Please enter the OTP");
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/auth/verify-otp', {
        email: user.email,
        otp: user.otp
      });
      setOtpVerified(true);
      setSuccess("OTP verified successfully! Click Register to complete signup.");
      setError("");
    } catch (error) {
      setError("Invalid or expired OTP. Please try again.");
    }
  };

  //submit form logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/auth/signup', user);
      setLoading(false);
      navigate("/loginn");
    } catch (error) {
      setLoading(false);
      setError("Error creating account. Please try again.");
    }
  };

  //resend otp timer logic
  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Increment to next step and error setting logic
  const nextStep = () => {
    if (step === 1 && !user.name) {
      setError("Please enter your name");
      return;
    }
    if (step === 1 && !user.email) {
      setError("Please enter your email");
      return;
    }
   
    if (step === 1 && !user.gender) {
      setError("Please select your gender");
      return;
    }
    if (step === 1 && !user.role) {
      setError("Please select your role");
      return;
    }
    
    setError("");
    setStep(step + 1);
  };

  //decreement to previous step logic
  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text className="card-color text-white">
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text className="card-color text-white">
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={user.email}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>

            {/* <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text className="card-color text-white">
                  <FaCar />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="vehicleno"
                  placeholder="Vehicle Registration Number"
                  value={user.vehicleno}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group> */}

            <Form.Group className="mb-4">
              <InputGroup > 
                <InputGroup.Text className="card-color  text-white">
                  <FaVenusMars />
                </InputGroup.Text >
                <Form.Select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>s
                  <option value="female">Female</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text className="card-color  text-white">
                  <FaUserTag />
                </InputGroup.Text>
                <Form.Select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <div className="d-grid ">
              <Button
                size="md"
                onClick={nextStep}
                disabled={!allFieldsFilled()}
                className="mt-3 card-color text-white"
                style={{ backgroundColor: " #361c6b", borderColor: "#007bff" }}
              >
                Next <span className="ms-2">→</span>
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* {user.role === "admin" && (
              <Form.Group className="mb-4">
                <InputGroup>
                  <InputGroup.Text className="card-color text-white">
                    <FaShieldAlt />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="adminCode"
                    placeholder="Admin Code"
                    value={user.adminCode}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            )} */}

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text className="card-color text-white">
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleChange}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputGroup>
            </Form.Group>
            
            {user.password && (
              <div className="mb-4">
                <ProgressBar 
                  variant={getPasswordStrengthColor()} 
                  now={(passwordStrength / 5) * 100} 
                  className="mb-2"
                />
                <small className={`text-${getPasswordStrengthColor()}`}>
                  Password Strength: {getPasswordStrengthLabel()}
                </small>
                <div className="password-tips mt-1">
                  <small className="text-muted">
                    Tips: Use at least 6 characters, include uppercase, numbers, and special characters
                  </small>
                </div>
              </div>
            )}

            <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text className="card-color text-white">
                  <FaLock />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={user.confirmPassword}
                  onChange={handleChange}
                />
              </InputGroup>
              {user.password && user.confirmPassword && user.password !== user.confirmPassword && (
                <Form.Text className="text-danger">
                  Passwords do not match
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="outline-secondary"
                onClick={prevStep}
                size="sm"
              >
                <span className="me-2">←</span> Back
              </Button>
              <Button
                variant="primary"
                onClick={handleSendOtp}
                size="sm"
                disabled={!allFieldsFilled() || loading}
                style={{ backgroundColor: " #361c6b", borderColor: "#007bff" }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Sending OTP...
                  </>
                ) : (
                  <>Send OTP</>
                )}
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="text-center mb-4">
              <FaKey size={50} className="text-success mb-3" />
              <h5>Verify Your Email</h5>
              <p className="text-muted">
                We've sent a verification code to <strong>{user.email}</strong>
              </p>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={user.otp}
                onChange={handleChange}
                className="form-control-lg text-center"
                maxLength="6"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant={otpVerified ? "success" : ""}
                onClick={handleVerifyOtp}
                disabled={otpVerified}
                className="mb-3"
                style={{ backgroundColor: otpVerified ? "green" : "#361c6b", borderColor: "#007bff",color: "white" }} 
              >
                {otpVerified ? (
                  <>
                    <FaCheckCircle className="me-2" /> Verified
                  </>
                ) : (
                  <>Verify OTP</>
                )}
              </Button>

              <Button
                variant="success"
                type="submit"
                disabled={!otpVerified || loading}
                onClick={handleSubmit}
                style={{ backgroundColor: " #361c6b", borderColor: "#007bff",color: "white" }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Registering...
                  </>
                ) : (
                  <>Complete Registration</>
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              {timer > 0 ? (
                <p className="text-muted">
                  Resend OTP in {timer}s
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Resending...
                    </>
                  ) : (
                    <>Resend OTP</>
                  )}
                </Button>
              )}
            </div>

            <div className="d-flex justify-content-start mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={prevStep}
              >
                <span className="me-2">←</span> Back
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="auth-page py-5">
      <Row className="justify-content-center">
      <Col md={6} className="d-none d-md-flex">
          <div className="signup-image-container">
            <div className="signup-content text-center">
              <h2 className="display-5 fw-bold text-white mb-4">Car Insurance Made Simple</h2>
              <p className="lead text-white mb-4">
                Join thousands of satisfied customers who trust us with their vehicles
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaShieldAlt size={30} /> 
                  </div>
                  <div className="feature-text">
                    <h5>Complete Protection</h5>
                    <p>Comprehensive coverage for your vehicle</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <FaCheckCircle size={30} />
                  </div>
                  <div className="feature-text">
                    <h5>Easy Claims</h5>
                    <p>Quick and hassle-free claim process</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="signup-image"></div>
          </div> 
        </Col>
        <Col md={4} className="mb-4 mb-md-0">
         
          
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="card-color text-white text-center py-4">
              <h3 className="mb-0 fw-bold">Create Account</h3>
              <p className="mb-0 mt-2">Join our car insurance community</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {(error || success) && (
                <Alert variant={error ? "danger" : "success"} className="mb-4">
                  {error || success}
                </Alert>
              )}
              
              <div className="step-progress mb-4">
                <ProgressBar now={(step / 3) * 100} variant="success" className="mb-3" />
                <div className="d-flex justify-content-between">
                  <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-circle">1</div>
                    <div className="step-text">Details</div>
                  </div>
                  <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-circle">2</div>
                    <div className="step-text">Password</div>
                  </div>
                  <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <div className="step-text">Verify</div>
                  </div>
                </div>
              </div>
              
              <Form>
                {renderStep()}
              </Form>
            </Card.Body>
            
            <Card.Footer className="bg-light card-footer text-center">
               <div className="mt-2">
                              <div className="separator">
                                <span>OR</span>
                              </div>
                              
                              <div className="mt-4 mb-3">
                                <Button 
                                  variant="outline-light" 
                                  className="w-100 d-flex align-items-center justify-content-center card-color"
                                  onClick={() => navigate("/loginn")}
                                >
                                  <FaUserPlus className="me-2 " /> Login with your Account
                                </Button>
                              </div>
                            </div>
            </Card.Footer>
          </Card>
        </Col>

       
      </Row>
    </Container>
  );
}

export default Signupp;