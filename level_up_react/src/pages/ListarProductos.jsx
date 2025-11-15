import React, { useState, useEffect } from 'react';
import listaProductos from '../assets/listaProductos.js';
import '../styles/pages/listarProductos.css';

const ProductList = ({ products: initialProducts, onEdit, onDelete }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Cargar productos iniciales (desde props o lista por defecto)
  useEffect(() => {
    const source =
      initialProducts && initialProducts.length
        ? initialProducts
        : listaProductos;

    setProducts(source);
    setFilteredProducts(source);
  }, [initialProducts]);

  // Filtrado por texto y categoría
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.Nombre.toLowerCase().includes(term) ||
          product.Código.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.Categoría === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const categories = [...new Set(products.map((p) => p.Categoría))];

  const handleDelete = (codigo) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      if (typeof onDelete === 'function') {
        onDelete(codigo); // Se encarga el padre (AdminProductosPage)
      }
      const updatedProducts = products.filter(
        (product) => product.Código !== codigo
      );
      setProducts(updatedProducts);
    }
  };

  return (
    <div className="product-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => {
          let imgSrc = null;

          if (product.imgLink) {
            try {
              const required = require(`../${product.imgLink}`);
              imgSrc = required && required.default ? required.default : required;
            } catch (err) {
              imgSrc = null;
            }
          }

          const handleImgError = (e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="Arial, Helvetica, sans-serif" font-size="18">Imagen no disponible</text></svg>';
          };

          return (
            <div key={product.Código} className="product-card">
              <div className="product-image">
                <img
                  src={imgSrc || ''}
                  alt={product.Nombre}
                  onError={handleImgError}
                />
              </div>

              <div className="product-info">
                <h3>{product.Nombre}</h3>
                <p className="product-code">Código: {product.Código}</p>
                <p className="product-category">{product.Categoría}</p>
                <p className="product-price">{product.Precio}</p>
                <p className="product-stock">Stock: {product.Stock}</p>
                <p className="product-rating">
                  Puntuación: {product.Puntuacion}/10
                </p>

                <div className="product-actions">
                  <button
                    onClick={() => {
                      if (typeof onEdit === 'function') {
                        onEdit(product); // importante: que el padre reciba el producto
                      }
                    }}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.Código)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
