import React from 'react';
import ProductCard from './ProductCard';
import '../styles/components/productGridStyles.css';


export default function ProductGrid () {
    return (
        <div className="productosContainer" id="destacadosContainer">
            <ProductCard />
            {/* Más productos aquí */}
        </div>
    );
};