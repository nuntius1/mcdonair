import axios from "axios";

// Use relative URLs in development (for Vite proxy) or full URL in production
const API_URL = import.meta.env.DEV 
  ? "" // Empty string = relative URLs, will use Vite proxy
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Password validation regex
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;