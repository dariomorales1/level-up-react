import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = () => {
    return (
        <div className="productosContainer" id="destacadosContainer">
            <ProductCard />
            {/* Más productos aquí */}
        </div>
    );
};

export default ProductGrid;