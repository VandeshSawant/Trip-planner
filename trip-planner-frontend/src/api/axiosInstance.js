import axios from "axios";

// Create an Axios instance with baseURL http://localhost:8080
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isLoginRequest = error.config?.url === "/auth/login";
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
