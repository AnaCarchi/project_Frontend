export const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password.length >= 6;
  },

  username: (username) => {
    return username.length >= 3 && username.length <= 50;
  },

  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  minLength: (value, min) => {
    return value.length >= min;
  },

  maxLength: (value, max) => {
    return value.length <= max;
  },

  price: (price) => {
    return !isNaN(price) && parseFloat(price) > 0;
  },

  stock: (stock) => {
    return !isNaN(stock) && parseInt(stock) >= 0;
  },
};