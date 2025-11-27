// src/pages/Catalogo.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/header';
import CardsContainer from '../components/gridCards';
import NavbarProductos from '../components/navProductos';
import productService from '../services/productService';
import '../styles/pages/catalogoStyles.css';

export default function Catalogo() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Cargando productos desde productService...');
      const productsData = await productService.getAllProducts();

      console.log('Respuesta bruta de getAllProducts:', productsData);

      if (!Array.isArray(productsData)) {
        console.error('productsData NO ES ARRAY:', productsData);
        setProducts([]);
        return;
      }

      setProducts(productsData);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductsReload = async () => {
    await fetchProducts();
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      console.warn('filteredProducts: products no es un array:', products);
      return [];
    }

    if (!selectedCategory || selectedCategory === 'todos') {
      return products;
    }

    return products.filter((p) => {
      const cat = p.categoria || p.category || p.Categoría || null;
      return cat === selectedCategory;
    });
  }, [selectedCategory, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // ================= ESTADOS VISUALES =================

  if (loading) {
    return (
      <div className="page">
        <Header />
        <main>
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
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header />
        <main>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <hr />
              <h1 className="titulo">Catálogo</h1>
              <div className="alert alert-danger mt-4">
                <h5>Error</h5>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={handleProductsReload}>
                  Reintentar
                </button>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="page">
        <Header />
        <main>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <hr />
              <h1 className="titulo">Catálogo</h1>
              <div className="alert alert-info mt-4">
                <h5>No hay productos disponibles</h5>
                <p>No se encontraron productos en el catálogo.</p>
                <button className="btn btn-primary" onClick={handleProductsReload}>
                  Recargar
                </button>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="page">
      <Header />
      <main>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <hr />
            <h1 className="titulo">Catálogo</h1>
            <h4 className="titulo2">
              {selectedCategory && selectedCategory !== 'todos'
                ? selectedCategory
                : 'Todos los Productos'}
            </h4>
            <hr />

            <NavbarProductos onCategoryChange={handleCategoryChange} />

            <CardsContainer
              productos={Array.isArray(filteredProducts) ? filteredProducts : []}
            />
          </div>
          <div className="col-2"></div>
        </div>
      </main>
    </div>
  );
}
