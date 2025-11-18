import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import ListarProductos from './ListarProductos';
import ActualizarProducto from './ActualizarProducto';
import productService from '../services/productService';
import '../styles/pages/panelAdministrador.css';

const AdminProductos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => setEditingProduct(product);

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await productService.updateProduct(updatedProduct.Código, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.Código === updatedProduct.Código ? updatedProduct : p))
      );
      setEditingProduct(null);
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el producto');
    }
  };

  const handleDeleteProduct = async (codigo) => {
    if (!window.confirm(`¿Eliminar producto ${codigo}?`)) return;
    try {
      await productService.deleteProduct(codigo);
      setProducts((prev) => prev.filter((p) => p.Código !== codigo));
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el producto');
    }
  };

  const handleCancel = () => setEditingProduct(null);

  return (
    <div className="product-management">
      <div className="management-layout">
        <SideBar currentView="productos" />
        <main className="management-main">
          {loading ? (
            <div>Cargando productos...</div>
          ) : !editingProduct ? (
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
