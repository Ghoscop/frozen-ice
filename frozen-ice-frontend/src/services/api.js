
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Envia o token de autenticação quando existir.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("frozen_ice_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Se a API responder 401, a sessão não está mais autorizada.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("frozen_ice_token");
    }

    return Promise.reject(error);
  }
);

export default api;
