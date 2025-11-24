import axios from 'axios';

const API_BASE_URL = 'http://levelup.ddns.net:8080/products';

// Configurado con timeout
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productService = {

  getAllProducts: async () => {
    try {
      console.log('Obteniendo productos desde:', API_BASE_URL);
      const response = await axiosInstance.get('/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching products:', error.response || error.message);
      throw new Error(`Error al cargar productos: ${error.message}`);
    }
  },

  getProductByCode: async (productCode) => {
    try {
      const response = await axiosInstance.get(`/${productCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error.response || error.message);
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  },

  addProduct: async (product) => {
    try {
      const formatted = {
        ...product,
        especificaciones:
          product.especificaciones?.map((spec) =>
            typeof spec === 'string' ? { specification: spec } : spec
          ) || [],
      };

      const response = await axiosInstance.post('/', formatted);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error.response || error.message);
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  },

  updateProduct: async (codigo, productData) => {
    try {
      // 🔥 Siempre normalizamos las especificaciones
      const formatted = {
        ...productData,
        especificaciones: (productData.especificaciones || []).map((s) => ({
          id: s.id ?? null,
          specification: s.specification ?? s
        }))
      };

      const response = await axios.put(`${API_BASE_URL}/${codigo}`, formatted);
      return response.data;

    } catch (error) {
      console.error('Error updating product:', error.response || error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error.response || error.message);
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  },

  healthCheck: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error.response || error.message);
      throw new Error(`Error de health check: ${error.message}`);
    }
  },

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
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 10000,
        }
      );

      return response.data;

    } catch (error) {
      console.error('Error uploading product image:', error.response || error.message);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  },

  addResena: async (productCode, { comentario, puntuacion, usuarioId }) => {
    try {
      const body = { comentario, puntuacion, usuarioId };
      const response = await axiosInstance.post(
        `/${encodeURIComponent(productCode)}/resenas`,
        body
      );
      return response.data;
    } catch (error) {
      console.error('Error creando reseña:', error.response || error.message);
      throw new Error(`Error al crear reseña: ${error.message}`);
    }
  },

  updateResena: async (productCode, resenaId, { comentario, puntuacion }) => {
    try {
      const body = { comentario, puntuacion };
      const response = await axiosInstance.put(
        `/${encodeURIComponent(productCode)}/resenas/${resenaId}`,
        body
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar reseña:', error.response || error.message);
      throw new Error(`Error al actualizar reseña: ${error.message}`);
    }
  },

  deleteResena: async (productCode, resenaId) => {
    try {
      const response = await axiosInstance.delete(
        `/${encodeURIComponent(productCode)}/resenas/${resenaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar reseña:', error.response || error.message);
      throw new Error(`Error al eliminar reseña: ${error.message}`);
    }
  },
};

export default productService;
