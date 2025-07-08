import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const login = async (email, password) => {
  return await axios.post(`${API_BASE}/login`, { email, password });
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

export const logout = () => {
  localStorage.removeItem('adminToken');
};
