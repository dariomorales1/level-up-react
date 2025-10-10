import React from 'react';
import {showToast} from '../components/toast';

const Blog = () => {
    return (
        <div className="container mt-4">
            <h1>Blog</h1>
            <button onClick={() => showToast("Hola")}>Agregar al carrito</button>
        </div>
    );
};

export default Blog;