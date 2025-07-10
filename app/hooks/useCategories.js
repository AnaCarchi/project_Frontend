import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import Toast from 'react-native-toast-message';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las categorías',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría creada correctamente',
      });
      return newCategory;
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo crear la categoría',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      setCategories(prev => 
        prev.map(category => 
          category.id === id ? updatedCategory : category
        )
      );
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría actualizada correctamente',
      });
      return updatedCategory;
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar la categoría',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría eliminada correctamente',
      });
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo eliminar la categoría',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};