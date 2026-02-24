import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import './RegisterPage.scss';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear email-specific error when user modifies the email field
    if (name === 'email' && emailError) {
      setEmailError('');
    }
    
    // Clear general error when any field changes
    if (error) {
      setError('');
    }
  };

  // Form validation
  const isFormValid = () => {
    return formData.fullname && formData.email && formData.password;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setEmailError('');
    
    try {
      const userData = await register(formData);
      login(userData);
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const { message } = err.response.data;
        
        // Handle specific error for existing email
        if (message.includes('Email already exists')) {
          setEmailError('User with this email already exists.');
        } else {
          setError(message || 'Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="register-page-container">
      <Card className="register-card">
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                isInvalid={!!emailError}
              />
              {emailError && (
                <Form.Text className="text-danger">{emailError}</Form.Text>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>
            
            {error && (
              <Alert variant="danger">{error}</Alert>
            )}
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 register-button"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;