import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get(ENDPOINTS.USERS.GET_ALL);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`${ENDPOINTS.USERS.GET_BY_ID}/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`${ENDPOINTS.USERS.UPDATE}/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`${ENDPOINTS.USERS.DELETE}/${id}`);
    return response.data;
  },

  toggleUserLock: async (id) => {
    const response = await api.patch(`${ENDPOINTS.USERS.GET_BY_ID}/${id}/toggle-lock`);
    return response.data;
  },

  changePassword: async (id, passwords) => {
    const response = await api.patch(`${ENDPOINTS.USERS.GET_BY_ID}/${id}/change-password`, passwords);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get(`${ENDPOINTS.USERS.GET_ALL}/stats`);
    return response.data;
  },
};