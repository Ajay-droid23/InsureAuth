import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login.css';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  ProgressBar,
  InputGroup 
} from 'react-bootstrap';
import { 
  EnvelopeAt, 
  Key, 
  ShieldLock, 
  CheckCircle, 
  ArrowLeft, 
  EyeFill, 
  EyeSlashFill 
} from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: request reset, 2: verify OTP, 3: set new password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/auth/request-password-reset', { email });
      setSuccess(response.data.message);
      setError("");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.error || "Error requesting password reset");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/auth/verify-reset-otp', { email, otp });
      setSuccess(response.data.message);
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.error || "Error verifying OTP");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/auth/reset-password', { email, password });
      setSuccess(response.data.message);
      setError("");
      setTimeout(() => navigate("/loginn"), 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Error resetting password");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Request Password Reset";
      case 2: return "Verify OTP";
      case 3: return "Create New Password";
      default: return "Reset Password";
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-4">
        <ProgressBar>
          <ProgressBar 
            variant={step >= 1 ? "success" : "secondary"} 
            now={step >= 1 ? 33.3 : 0} 
            key={1} 
          />
          <ProgressBar 
            variant={step >= 2 ? "success" : "secondary"} 
            now={step >= 2 ? 33.3 : 0} 
            key={2} 
          />
          <ProgressBar 
            variant={step >= 3 ? "success" : "secondary"} 
            now={step >= 3 ? 33.3 : 0} 
            key={3} 
          />
        </ProgressBar>
        <div className="d-flex justify-content-between mt-1">
          <small className={step >= 1 ? "text-success" : "text-muted"}>Email</small>
          <small className={step >= 2 ? "text-success" : "text-muted"}>Verification</small>
          <small className={step >= 3 ? "text-success" : "text-muted"}>New Password</small>
        </div>
      </div>
    );
  };

  return (
    <Container fluid className="main-color min-vh-100 d-flex align-items-center py-5">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5} xl={4}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="card-color text-white text-center py-3">
              <h3 className="font-weight-bold mb-0">{getStepTitle()}</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {renderProgressBar()}

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {step === 1 && (
                <Form onSubmit={handleRequestReset}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <EnvelopeAt />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      We'll send a verification code to this email.
                    </Form.Text>
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100  py-2" 
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleVerifyOtp}>
                  <Form.Group className="mb-4">
                    <Form.Label>Verification Code</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <ShieldLock />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter the 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Enter the code sent to {email}
                    </Form.Text>
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setStep(1)} 
                      className="w-25"
                    >
                      <ArrowLeft /> Back
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-75" 
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </Button>
                  </div>
                </Form>
              )}

              {step === 3 && (
                <Form onSubmit={handleResetPassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Key />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <CheckCircle />
                      </InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Password must be at least 6 characters long
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setStep(2)} 
                      className="w-25"
                    >
                      <ArrowLeft /> Back
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-75" 
                      disabled={loading}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
            <Card.Footer className="text-center py-3 bg-light">
              <p className="m-0">
                Remembered your password? <a href="#" onClick={() => navigate("/loginn")} className="text-primary fw-bold text-decoration-none">Log In</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;