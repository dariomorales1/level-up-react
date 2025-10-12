import React, { useEffect } from 'react';
<<<<<<< HEAD:level_up_react/src/pages/home.js
import Header from '../components/header';
import Carousel from '../components/Carousel';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
=======
import MyCarousel from '../components/Carousel';
import CardsContainer from '../components/gridCards';
>>>>>>> ab4fa8621938f2d3ccf66f7c0d27fd99d351b5ad:level_up_react/src/pages/home.jsx
import '../styles/pages/homeStyles.css';

export default function Home () {
    
    useEffect(() => {
        // Cargar Bootstrap JS
        const bootstrapScript = document.createElement('script');
        bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js';
        bootstrapScript.integrity = 'sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI';
        bootstrapScript.crossOrigin = 'anonymous';
        document.body.appendChild(bootstrapScript);

        return () => {
            document.body.removeChild(bootstrapScript);
        };
    }, []);

    return (
        <div className="page">
            <main>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <Carousel />
                        <hr />
                        <h1 className="titulo">Destacados</h1>
                        <hr />
                        <ProductGrid />
                    </div>
                    <div className="col-2"></div>
                </div>
            </main>
        </div>
    );
};
