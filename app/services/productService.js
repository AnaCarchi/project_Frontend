import api from './api';
import { ENDPOINTS } from '../utils/constants';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get(ENDPOINTS.PRODUCTS.GET_ALL);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`${ENDPOINTS.PRODUCTS.GET_BY_ID}/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post(ENDPOINTS.PRODUCTS.CREATE, productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`${ENDPOINTS.PRODUCTS.UPDATE}/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`${ENDPOINTS.PRODUCTS.DELETE}/${id}`);
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get(`${ENDPOINTS.PRODUCTS.SEARCH}?name=${query}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`${ENDPOINTS.PRODUCTS.BY_CATEGORY}/${categoryId}`);
    return response.data;
  },

  uploadProductImage: async (productId, formData) => {
    const response = await api.post(`${ENDPOINTS.PRODUCTS.GET_BY_ID}/${productId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};