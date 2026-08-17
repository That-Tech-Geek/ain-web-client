import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ain-enterprise-api.vercel.app/api/v1',
});

// Interceptor to attach the API key dynamically from localStorage
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('ain_api_key');
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (firebaseIdToken) => {
  const response = await api.post('/auth/login', { firebase_id_token: firebaseIdToken });
  return response.data;
};

export const checkPaper = async (text) => {
  const response = await api.post('/research/check-paper', { text });
  return response.data;
};

export const getCitations = async (query, limit = 5) => {
  const response = await api.get('/research/cite', {
    params: { query, limit }
  });
  return response.data;
};

export default api;
