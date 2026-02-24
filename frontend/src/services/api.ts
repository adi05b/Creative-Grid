// frontend/src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create a base axios instance for API calls
const api: AxiosInstance = axios.create({
  baseURL: '/api',  // This will be relative to wherever your app is served from
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies if using authentication
});

// Add a response interceptor to extract data from responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return just the data, not the entire response
    return response.data;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;