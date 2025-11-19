import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Header from '../components/header';
import CardsContainer from '../components/gridCards';
import NavbarProductos from '../components/navProductos';
import productService from '../services/productService'; // Importación CORRECTA
import '../styles/pages/catalogoStyles.css';

export default function Catalogo() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Iniciando carga de productos...');
      
      // ✅ LLAMADA CORREGIDA - productService es el objeto exportado por defecto
      const productsData = await productService.getAllProducts();
      
      console.log('📦 Productos cargados:', productsData);
      setProducts(productsData || []);
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar recarga de productos
  const handleProductsReload = async () => {
    await fetchProducts();
  };

  // Filtrar productos por categoría
  const filteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'todos') {
      return products;
    }
    return products.filter(producto => producto.categoria === selectedCategory);
  }, [selectedCategory, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Estado de carga
  if (loading) {
    return (
      <div>
        <Header />
        <main>
          <div className="container-fluid">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-8">
                <hr />
                <h1 className="titulo">Catálogo</h1>
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando productos...</p>
                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div>
        <Header />
        <main>
          <div className="container-fluid">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-8">
                <hr />
                <h1 className="titulo">Catálogo</h1>
                <div className="alert alert-danger">
                  <h5>Error</h5>
                  <p>{error}</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleProductsReload}
                  >
                    Reintentar
                  </button>
                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Estado sin productos
  if (products.length === 0) {
    return (
      <div>
        <Header />
        <main>
          <div className="container-fluid">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-8">
                <hr />
                <h1 className="titulo">Catálogo</h1>
                <div className="alert alert-info">
                  <h5>No hay productos disponibles</h5>
                  <p>No se encontraron productos en el catálogo.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleProductsReload}
                  >
                    Recargar
                  </button>
                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Estado normal con productos
  return (
    <div>
      <Header />
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <hr />
              <h1 className="titulo">
                Catálogo
              </h1>
              <h4 className='titulo2'>
                {selectedCategory ? `${selectedCategory}` : 'Todos los Productos'}
              </h4>
              <hr />
              <NavbarProductos onCategoryChange={handleCategoryChange} />
              <CardsContainer productos={filteredProducts} />
            </div>
            <div className="col-2"></div>
          </div>
        </div>
      </main>
    </div>
  );
}