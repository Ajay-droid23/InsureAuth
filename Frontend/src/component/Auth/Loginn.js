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
  InputGroup,
  Spinner
} from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaLock, 
  FaUserShield,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      const { role, user, token } = response.data;
  
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
  
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "agent") {
        navigate("/agent");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container fluid className="auth-page py-5">
      <Row className="justify-content-center">
      <Col md={6} className="d-none d-md-flex">
          <div className="login-image-container">
            <div className="login-content text-center">
              <h2 className="display-4 fw-bold text-white mb-4">Welcome to Premium Car Insurance</h2>
              <p className="lead text-white mb-4">
                Access your account to manage your car insurance policies
              </p>
              
              <div className="login-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FaUserShield size={30} />
                  </div>
                  <div className="benefit-text">
                    <h5>Secure Login</h5>
                    <p>Your information is protected with industry-standard security</p>
                  </div>
                </div>
                <div className="login-features">
                  <div className="feature-badge">
                    <span>Policy Management</span>
                  </div>
                  <div className="feature-badge">
                    <span>Claim Status</span>
                  </div>
                  <div className="feature-badge">
                    <span>Premium Payment</span>
                  </div>
                  <div className="feature-badge">
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="login-image"></div>
          </div>
        </Col>
        <Col md={4} className="mb-4 mb-md-0">
         
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="card-color text-white text-center py-4">
              <h3 className="mb-0 fw-bold">Welcome Back</h3>
              <p className="mb-0 mt-2">Sign in to your account</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4 animate__animated animate__fadeIn">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="card-color text-white">
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="card-color text-white">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button 
                      variant="outline-secondary"
                      className=" card-color text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputGroup>
                </Form.Group>
                
                <div className="d-flex justify-content-end mb-4">
                  <Button 
                    variant="link" 
                    className="p-0 forgot text-decoration-none"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="d-grid">
                  <Button
                    variant="white"
                    size="md"
                    type="submit"
                    disabled={loading}
                    className="login-btn"
                    style={{ backgroundColor: "#361c6b", color: "white" } }
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" /> Sign In
                      </>
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="mt-4">
                <div className="separator">
                  <span>OR</span>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={() => navigate("/signupp")}
                    style={{ backgroundColor: "#361c6b", color: "white" }}
                  >
                    <FaUserPlus className="me-2" /> Create New Account
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

       
      </Row>
    </Container>
  );
};

export default Login;