
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Spinner, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import AdminUI from './AdminUI';
import logo from "./images/logo-text.png";



const AgentPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserString = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUserString || !token) {
          navigate('/');
          return;
        }

        const storedUser = JSON.parse(storedUserString);
        
        if (!storedUser?.email) {
          navigate('/');
          return;
        }

        const response = await axios.get(`http://localhost:5000/user/${storedUser.email}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          vehicleno: response.data.vehicleno,
          gender: response.data.gender
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowModal(true);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('vehicleno', formData.vehicleno);
      formDataToSend.append('gender', formData.gender);
      
      if (fileInputRef.current.files[0]) {
        formDataToSend.append('profilePicture', fileInputRef.current.files[0]);
      }

      const response = await axios.put(
        `http://localhost:5000/user/${user.email}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser(response.data);
      setEditMode(false);
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user')),
        name: response.data.name,
        vehicleno: response.data.vehicleno,
        gender: response.data.gender,
        profilePicture: response.data.profilePicture
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/user/${user.email}/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.response?.data?.error || 'Error changing password');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm fixed-top">
        <img src={logo} alt="Logo" style={{ width: '150px' }} />
        <div 
          onClick={handleProfileClick}
          className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
          style={{
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {user?.profilePicture ? (
            <Image 
              src={`http://localhost:5000/public/${user.profilePicture}`} 
              roundedCircle 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="text-center  pt-5">
        <AdminUI/>
      </div>

      {/* Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5">
         
<i className="bi bi-person-circle"></i>
            My Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="text-center mb-3">
            <div className="position-relative d-inline-block">
              {user?.profilePicture ? (
                <Image 
                  src={`http://localhost:5000/public/${user.profilePicture}`}
                  roundedCircle
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  className="border border-2 border-primary"
                />
              ) : (
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                  style={{ width: '80px', height: '80px', fontSize: '30px' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {editMode && (
                <button 
                  className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 border border-primary"
                  onClick={() => fileInputRef.current.click()}
                  style={{ width: '28px', height: '28px' }}
                >
                 <i className="bi bi-pencil-square"></i>

                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              className="d-none"
              onChange={(e) => {
                if (e.target.files[0]) {
                  const reader = new FileReader();
                  
                  reader.onload = (event) => {
                    setUser({...user, profilePicture: event.target.result});
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </div>

          <Form>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label className="small text-muted mb-1">Name</Form.Label>
                {!editMode && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 text-decoration-none"
                    onClick={() => setEditMode(true)}
                  >
                   <i className="bi bi-pencil-square"></i>

                    Edit
                  </Button>
                )}
              </div>
              {editMode ? (
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  size="sm"
                />
              ) : (
                <div className="p-2 bg-light rounded small">{user?.name || 'Not provided'}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-muted mb-1">Email</Form.Label>
              <div className="p-2 bg-light rounded small">{user?.email || 'Not provided'}</div>
            </Form.Group>

           

            <Form.Group className="mb-3">
              <Form.Label className="small text-muted mb-1">Gender</Form.Label>
              {editMode ? (
                <Form.Select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  size="sm"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              ) : (
                <div className="p-2 bg-light rounded small">{user?.gender || 'Not specified'}</div>
              )}
            </Form.Group>
          </Form>

          <div className="d-flex justify-content-between mt-3">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => editMode ? setEditMode(false) : setShowModal(false)}
            >
              {editMode ? 'Cancel' : 'Close'}
            </Button>
            
            {editMode ? (
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            ) : (

              
               <div>
                            <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={handleLogout}
                                            className='btn btn-danger me-3 text-white border-0'
                                          >
                                            
                                          
                            {/* <i className="bi bi-key"></i> */}
                            
                                            Logout
                                          </Button>
                            <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => setShowPasswordModal(true)}
                                          >
                                            
                                          
                            <i className="bi bi-key"></i>
                            
                                            Change Password
                                          </Button>
                                          </div>
              
              
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Compact Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5">
         
<i className="bi bi-key"></i>

            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {passwordError && <Alert variant="danger" className="py-2">{passwordError}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted">Current Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                size="sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted">New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                size="sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                size="sm"
              />
            </Form.Group>
          </Form>
          <div className="d-flex justify-content-end gap-2 mt-2">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleChangePassword}
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AgentPage;