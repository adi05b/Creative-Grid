import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import './LoginPage.scss';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty }, 
    //setError, 
    //clearErrors 
  } = useForm<LoginFormData>({ mode: 'onChange' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const userData = await login(data);
      authLogin(userData);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle server validation errors
      if (error.response?.status === 401) {
        setServerError('Password or email is incorrect.');
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear server error when form is changed
  const handleInputChange = () => {
    if (serverError) {
      setServerError(null);
    }
  };

  return (
    <Container className="login-page-container">
      <Card className="login-card">
        <Card.Body>
          <h2>Login</h2>
          
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                isInvalid={!!errors.email || serverError?.includes('email')}
                {...register('email', { 
                  required: true, 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email must be valid.'
                  },
                  onChange: handleInputChange
                })}
              />
              {errors.email?.type === 'required' && (
                <Form.Text className="text-danger">Email is required.</Form.Text>
              )}
              {errors.email?.type === 'pattern' && (
                <Form.Text className="text-danger">Email must be valid.</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                isInvalid={!!errors.password || serverError?.includes('password')}
                {...register('password', { 
                  required: true,
                  onChange: handleInputChange
                })}
              />
              {errors.password?.type === 'required' && (
                <Form.Text className="text-danger">Password is required.</Form.Text>
              )}
            </Form.Group>

            {serverError && (
              <Form.Text className="text-danger d-block mb-3">
                {serverError}
              </Form.Text>
            )}

            <Button 
              variant="primary" 
              type="submit" 
              className="login-button w-100"
              disabled={!isValid || isLoading || !isDirty}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            Don't have an account yet? <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;