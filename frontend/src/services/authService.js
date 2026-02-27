import api from './api';

const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response;
};

const login = async (userData) => {
  const response = await api.post('/login', userData);
  return response;
};

const logout = async () => {
  const response = await api.post('/logout');
  return response;
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
