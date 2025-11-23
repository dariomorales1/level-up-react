// src/services/productService.jsx
import axios from 'axios';

const API_BASE_URL = 'http://levelup.ddns.net:8080/products';

// Configurar axios con timeout
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      console.log('Obteniendo productos desde:', API_BASE_URL);
      const response = await axiosInstance.get('/');
      console.log('Productos obtenidos (raw):', response.data);

      // El backend ya devuelve JSON correcto (lista de productos)
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn(
        '⚠ getAllProducts: la respuesta no es un array, devolviendo []',
        response.data
      );
      return [];
    } catch (error) {
      console.error('Error fetching products:', error.response || error.message);
      throw new Error(`Error al cargar productos: ${error.message}`);
    }
  },

  // Obtener producto por código
  getProductByCode: async (productCode) => {
    try {
      const response = await axiosInstance.get(`/${productCode}`);
      console.log('🧩 getProductByCode - producto:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error.response || error.message);
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  },

  // Agregar nuevo producto
  addProduct: async (product) => {
    try {
      // Convertir especificaciones de string[] a [{ specification }]
      const formattedProduct = {
        ...product,
        especificaciones:
          product.especificaciones?.map((spec) =>
            typeof spec === 'string' ? { specification: spec } : spec
          ) || [],
      };

      const response = await axiosInstance.post('/', formattedProduct);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error.response || error.message);
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  },

  // Actualizar producto
  updateProduct: async (codigo, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${codigo}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error.response || error);
      throw error;
    }
  },

  // Eliminar producto
  deleteProduct: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error.response || error.message);
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  },

  // Verificar salud del servicio
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error.response || error.message);
      throw new Error(`Error de health check: ${error.message}`);
    }
  },

  // Subir imagen de producto a Supabase vía backend
  uploadProductImage: async (codigo, file, categoria, nombreProducto) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('categoria', categoria);
      formData.append('nombreProducto', nombreProducto);

      const response = await axios.post(
        `${API_BASE_URL}/${encodeURIComponent(codigo)}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 10000,
        }
      );

      return response.data; // { publicUrl: "..." }
    } catch (error) {
      console.error(
        'Error uploading product image:',
        error.response || error.message
      );
      throw new Error(`Error al subir imagen de producto: ${error.message}`);
    }
  },

  // ================== RESEÑAS ==================

  // Crear reseña
  addResena: async (productCode, { comentario, puntuacion, usuarioId }) => {
    try {
      const body = {
        comentario,
        puntuacion, // int 1–10
        usuarioId,
      };
      const response = await axiosInstance.post(
        `/${encodeURIComponent(productCode)}/resenas`,
        body
      );
      return response.data; // Resena creada
    } catch (error) {
      console.error('Error al crear reseña:', error.response || error.message);
      throw new Error(`Error al crear reseña: ${error.message}`);
    }
  },

  // Actualizar reseña
  updateResena: async (productCode, resenaId, { comentario, puntuacion }) => {
    try {
      const body = {
        comentario,
        puntuacion,
      };
      const response = await axiosInstance.put(
        `/${encodeURIComponent(productCode)}/resenas/${resenaId}`,
        body
      );
      return response.data; // Resena actualizada
    } catch (error) {
      console.error('Error al actualizar reseña:', error.response || error.message);
      throw new Error(`Error al actualizar reseña: ${error.message}`);
    }
  },

  // Eliminar reseña
  deleteResena: async (productCode, resenaId) => {
    try {
      const response = await axiosInstance.delete(
        `/${encodeURIComponent(productCode)}/resenas/${resenaId}`
      );
      return response.data; // MessageResponse
    } catch (error) {
      console.error('Error al eliminar reseña:', error.response || error.message);
      throw new Error(`Error al eliminar reseña: ${error.message}`);
    }
  },
};

export default productService;
