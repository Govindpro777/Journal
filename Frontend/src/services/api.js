import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const journalAPI = {
  getEntries: () => api.get('/entries'),
  createEntry: (entry) => api.post('/entries', entry),
  updateEntry: (id, entry) => api.put(`/entries/${id}`, entry),
  deleteEntry: (id) => api.delete(`/entries/${id}`),
  getQuote: () => api.get('/quotes'),
};

export default api;