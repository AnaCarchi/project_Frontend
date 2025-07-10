import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import Toast from 'react-native-toast-message';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los productos',
      });
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error en la búsqueda',
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductsByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los productos de la categoría',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Producto creado correctamente',
      });
      return newProduct;
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo crear el producto',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Producto actualizado correctamente',
      });
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar el producto',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Producto eliminado correctamente',
      });
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo eliminar el producto',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
