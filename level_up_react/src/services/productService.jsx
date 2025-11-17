import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/products'; // Ajusta según tu API

// Configurar axios con timeout
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
    });

    const productService = {
    // Obtener todos los productos
    getAllProducts: async () => {
        try {
        console.log('📦 Obteniendo productos desde:', API_BASE_URL);
        const response = await axiosInstance.get('/');
        console.log('✅ Productos obtenidos:', response.data);
        return response.data;
        } catch (error) {
        console.error('❌ Error fetching products:', error);
        throw new Error(`Error al cargar productos: ${error.message}`);
        }
    },

    // Obtener producto por código
    getProductByCode: async (productCode) => {
        try {
        const response = await axiosInstance.get(`/${productCode}`);
        return response.data;
        } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
        }
    },

    // Agregar nuevo producto
    addProduct: async (product) => {
        try {
        const response = await axiosInstance.post('/', product);
        return response.data;
        } catch (error) {
        console.error('Error adding product:', error);
        throw error;
        }
    },

    // Actualizar producto
    updateProduct: async (productCode, product) => {
        try {
        const response = await axiosInstance.put(`/${productCode}`, product);
        return response.data;
        } catch (error) {
        console.error('Error updating product:', error);
        throw error;
        }
    },

    // Eliminar producto
    deleteProduct: async (productId) => {
        try {
        const response = await axiosInstance.delete(`/${productId}`);
        return response.data;
        } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
        }
    },

    // Verificar salud del servicio
    healthCheck: async () => {
        try {
        const response = await axiosInstance.get('/health');
        return response.data;
        } catch (error) {
        console.error('Health check failed:', error);
        throw error;
        }
    }
};

// Exportación por defecto CORRECTA
export default productService;