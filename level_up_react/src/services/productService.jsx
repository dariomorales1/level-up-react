import axios from 'axios';

const API_BASE_URL = 'http://levelup.ddns.net:8080/products';

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
        console.log('Productos obtenidos:', response.data);
        return response.data;
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
        const formattedProduct = {
            ...product,
            especificaciones: product.especificaciones?.map((spec) =>
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

    updateProduct: async (codigo, productData) => {
        try {
        const response = await axios.put(`${API_BASE_URL}/${codigo}`, productData);
        return response.data;
        } catch (error) {
        console.error('Error updating product:', error.response || error);
        throw error;
        }
    },

    deleteProduct: async (productCode) => {
        try {
        const response = await axiosInstance.delete(`/${productCode}`);
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
};

export default productService;
