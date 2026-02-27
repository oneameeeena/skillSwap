import api from './api';

const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response;
};

const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response;
};

const updateProfile = async (userData) => {
  const response = await api.put('/profile', userData);
  return response;
};

const userService = {
  getUsers,
  getUserById,
  updateProfile,
};

export default userService;
