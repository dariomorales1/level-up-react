import React from 'react';
import { useParams } from 'react-router-dom';

const Producto = () => {
    const { id } = useParams();
    
    return (
        <div className="container mt-4">
            <h1>Detalle del Producto #{id}</h1>
            {/* Migrar contenido de producto.html aquí */}
        </div>
    );
};

export default Producto;