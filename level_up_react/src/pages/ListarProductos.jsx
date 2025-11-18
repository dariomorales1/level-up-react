import React, { useState } from 'react';
import '../styles/pages/listarProductos.css';

const ListarProductos = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesName = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.categoria === categoryFilter : true;
    return matchesName && matchesCategory;
  });

  return (
    <div className="product-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Juegos de Mesa">Juegos de Mesa</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Consolas">Consolas</option>
          <option value="Computadores Gamers">Computadores Gamers</option>
          <option value="Sillas Gamers">Sillas Gamers</option>
          <option value="Mouse">Mouse</option>
          <option value="Mousepad">Mousepad</option>
          <option value="Poleras Personalizadas">Poleras Personalizadas</option>
          <option value="Polerones Gamers Personalizados">Polerones Gamers Personalizados</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">No hay productos que coincidan</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.codigo} className="product-card">
              <div className="product-image">
                <img src={product.imagenUrl || '/placeholder.png'} alt={product.nombre} />
              </div>
              <div className="product-info">
                <h3>{product.nombre}</h3>
                <div className="product-code">Código: {product.codigo}</div>
                <div className="product-category">Categoría: {product.categoria}</div>
                <div className="product-stock">Stock: {product.stock}</div>
                <div className="product-price">{product.precio}</div>
                <div className="product-actions">
                  <button className="btn-edit" onClick={() => onEdit(product)}>Editar</button>
                  <button className="btn-delete" onClick={() => onDelete(product.codigo)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListarProductos;
