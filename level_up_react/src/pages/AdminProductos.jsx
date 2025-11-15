// src/pages/AdminProductos.jsx
import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import ListarProductos from '../pages/ListarProductos';
import ActualizarProducto from '../pages/ActualizarProducto';
import listaProductos from '../assets/listaProductos';
import '../styles/pages/panelAdministrador.css';

const AdminProductos = () => {
  const [products, setProducts] = useState(listaProductos);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.Código === updatedProduct.Código ? updatedProduct : p
      )
    );
    setEditingProduct(null);
    alert('Producto actualizado exitosamente');
  };

  const handleDeleteProduct = (codigo) => {
    setProducts((prev) => prev.filter((p) => p.Código !== codigo));
    alert('Producto eliminado exitosamente');
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div className="product-management">
      <div className="management-layout">
        {/* Sidebar al lado izquierdo */}
        <SideBar currentView="productos" />

        {/* Contenido central */}
        <main className="management-main">
          {!editingProduct ? (
            <ListarProductos
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ) : (
            <ActualizarProducto
              product={editingProduct}
              onSave={handleUpdateProduct}
              onCancel={handleCancel}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProductos;
