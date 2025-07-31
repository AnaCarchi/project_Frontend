export const API_BASE_URL = 'http://192.168.100.7:8080/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE_TOKEN: '/auth/validate-token',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    SEARCH: '/products/search',
    BY_CATEGORY: '/products/category',
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: '/categories',
    CREATE: '/categories',
    UPDATE: '/categories',
    DELETE: '/categories',
  },
  USERS: {
    GET_ALL: '/admin/users',
    GET_BY_ID: '/admin/users',
    UPDATE: '/admin/users',
    DELETE: '/admin/users',
  },
  REPORTS: {
    PRODUCTS_PDF: '/reports/products/pdf/mobile',
    PRODUCTS_EXCEL: '/reports/products/excel/mobile',
    CATEGORIES_PDF: '/reports/categories/pdf/mobile',
    USERS_EXCEL: '/reports/users/excel/mobile',
    INVENTORY_PDF: '/reports/inventory/pdf/mobile',
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  THEME: 'app_theme',
};

export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
};

// URLs completas para debugging
export const FULL_URLS = {
  UPLOAD_PRODUCT_IMAGE: (id) => `http://192.168.100.7:8080/api/products/${id}/image`,
  UPLOAD_CATEGORY_IMAGE: (id) => `http://192.168.100.7:8080/api/categories/${id}/image`,
  VIEW_UPLOADS: 'http://192.168.100.7:8080/uploads/',
};