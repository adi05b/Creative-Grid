// src/services/authService.ts
import api from './api';

// Login data type
interface LoginData {
  email: string;
  password: string;
}

// Register data type
interface RegisterData {
  fullname: string;
  email: string;
  password: string;
}

// Response type
interface ApiResponse {
  status: string;
  data?: any;
  message?: string;
}

// Login function
export const login = async (data: LoginData) => {
  try {
    console.log('Login request with data:', data);
    const response = await api.post<ApiResponse>('/auth/login', data);
    console.log('Login response:', response.data);
    return response.data.data; // Return user data directly
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

// Register function
export const register = async (data: RegisterData) => {
  try {
    console.log('Register request with data:', {
      fullname: data.fullname,
      email: data.email,
      hasPassword: !!data.password
    });
    const response = await api.post<ApiResponse>('/auth/register', data);
    console.log('Register response:', response.data);
    return response.data.data; // Return user data directly
  } catch (error) {
    console.error('Register service error:', error);
    throw error;
  }
};

// Get current user function
export const getCurrentUser = async () => {
  try {
    console.log('Getting current user');
    const response = await api.get<ApiResponse>('/auth/me');
    console.log('Current user response:', response.data);
    return response.data; // Return the entire response
  } catch (error) {
    console.error('Get current user service error:', error);
    return null;
  }
};

// Logout function
export const logout = async () => {
  try {
    console.log('Logout request');
    const response = await api.post<ApiResponse>('/auth/logout');
    console.log('Logout response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Logout service error:', error);
    throw error;
  }
};

// Delete account function
export const deleteAccount = async () => {
  try {
    console.log('Delete account request');
    const response = await api.delete<ApiResponse>('/auth/delete-account');
    console.log('Delete account response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete account service error:', error);
    throw error;
  }
};