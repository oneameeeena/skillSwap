import api from './api';

const getSkills = async () => {
  const response = await api.get('/skills');
  return response;
};

const skillService = {
  getSkills,
};

export default skillService;
