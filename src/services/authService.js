import axios from 'axios';
import { API_BASE as API_BASE_RUNTIME } from '../utils/helpers';

const API_BASE = `${API_BASE_RUNTIME}/api`;

export const login = async (email, password) => {
  return await axios.post(`${API_BASE}/login`, { email, password });
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

export const logout = () => {
  localStorage.removeItem('adminToken');
};
