import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'https://testing-uade-production.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // No forzar redirección aquí, dejar que React Router maneje la autenticación
    return Promise.reject(error);
  }
);

export { api };

