import api from './api';

const createSwapRequest = async (swapData) => {
  const response = await api.post('/swaps', swapData);
  return response;
};

const getSwapRequests = async () => {
  const response = await api.get('/swaps');
  return response;
};

const updateSwapRequest = async (id, status) => {
  const response = await api.put(`/swaps/${id}`, status);
  return response;
};

const swapService = {
  createSwapRequest,
  getSwapRequests,
  updateSwapRequest,
};

export default swapService;
