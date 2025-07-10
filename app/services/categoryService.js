import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`${ENDPOINTS.CATEGORIES.GET_BY_ID}/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post(ENDPOINTS.CATEGORIES.CREATE, categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`${ENDPOINTS.CATEGORIES.UPDATE}/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`${ENDPOINTS.CATEGORIES.DELETE}/${id}`);
    return response.data;
  },

  uploadCategoryImage: async (categoryId, formData) => {
    const response = await api.post(`${ENDPOINTS.CATEGORIES.GET_BY_ID}/${categoryId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
