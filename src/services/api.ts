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
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string }) =>
    api.post('/auth/register', userData),
};

export const journalAPI = {
  getEntries: () => api.get('/entries'),
  createEntry: (entry: { title: string; content: string; mood: string }) =>
    api.post('/entries', entry),
  updateEntry: (id: string, entry: { title: string; content: string; mood: string }) =>
    api.put(`/entries/${id}`, entry),
  deleteEntry: (id: string) => api.delete(`/entries/${id}`),
  getQuote: () => api.get('/quotes'),
};

export default api;