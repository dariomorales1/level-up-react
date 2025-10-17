import React, { useState } from 'react';
import ListarProductos from './ListarProductos';
import CrearProducto from './CrearProducto';
import ActualizarProducto from './ActualizarProducto';
import SideBar from '../components/sideBar';
import listaProductos from '../assets/listaProductos';
import '../styles/pages/panelAdministrador.css';

const PanelAdministrador = () => {
    const [products, setProducts] = useState(listaProductos);
    const [currentView, setCurrentView] = useState('list');
    const [editingProduct, setEditingProduct] = useState(null);

    const handleCreateProduct = (newProduct) => {
        const existingProduct = products.find(p => p.Código === newProduct.Código);
        if (existingProduct) {
            alert('Ya existe un producto con ese código');
            return;
        }

        setProducts(prev => [...prev, newProduct]);
        setCurrentView('list');
        alert('Producto creado exitosamente');
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setCurrentView('update');
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(prev => 
            prev.map(p => p.Código === updatedProduct.Código ? updatedProduct : p)
        );
        setCurrentView('list');
        setEditingProduct(null);
        alert('Producto actualizado exitosamente');
    };

    const handleDeleteProduct = (codigo) => {
        setProducts(prev => prev.filter(p => p.Código !== codigo));
        alert('Producto eliminado exitosamente');
    };

    const handleCancel = () => {
        setCurrentView('list');
        setEditingProduct(null);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
        if (view !== 'update') {
            setEditingProduct(null);
        }
    };

    return (
        <div className="product-management">
            <div className="management-layout">
                <SideBar currentView={currentView} onViewChange={handleViewChange} />
                <main className="management-main">
                    {currentView === 'list' && (
                        <ListarProductos
                            products={products}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    )}

                    {currentView === 'create' && (
                        <CrearProducto
                            onSave={handleCreateProduct}
                            onCancel={handleCancel}
                        />
                    )}

                    {currentView === 'update' && editingProduct && (
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

export default PanelAdministrador;