import React, { useEffect } from 'react';
import Header from '../components/header';
import MyCarousel from '../components/Carousel';
import CardsContainer from '../components/gridCards';
import Footer from '../components/Footer';
import '../styles/pages/homeStyles.css';
import productosDestacados from '../assets/productosDestacados';

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
            <Header />
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <MyCarousel />
                            <hr />
                            <h1 className="titulo">Destacados</h1>
                            <hr />
                            <CardsContainer productos={productosDestacados} />
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
                
            </main>
            <Footer />
        </div>
    );
};
