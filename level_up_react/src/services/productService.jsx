import axios from 'axios';

const API_BASE_URL = 'http://levelup.ddns.net:8080/products'; // Ajusta según tu API

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
      console.log('Productos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error.response || error.message);
      throw new Error(`Error al cargar productos: ${error.message}`);
    }
  },

  // Obtener producto por código
  getProductByCode: async (productCode) => {
    try {
      const response = await axiosInstance.get(`/${productCode}`);
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
      // Retornamos el producto actualizado o solo el mensaje
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

  // 🔴 NUEVO: subir imagen de producto a Supabase vía backend
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
            // OJO: para multipart dejamos que axios ponga el boundary
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
};

export default productService;
