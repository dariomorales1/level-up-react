import React from 'react';
<<<<<<< HEAD:level_up_react/src/pages/catalogo.js

const Catalogo = () => {
    return (
        <div className="container mt-4">
            <h1>Catálogo de Productos</h1>
            {/* Migrar contenido de catalogo.html aquí */}
=======
import '../styles/pages/catalogoStyles.css';
import Header from '../components/header';
import CardsContainer from '../components/gridCards';

import listaProductos from '../assets/listaProductos';

const Catalogo = () => {
    return (
        <div >
            <Header />
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <hr />
                            <h1 className="titulo">Catálogo de Producto</h1>
                            <hr />
                            <CardsContainer productos={listaProductos} />
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
                
            </main>
>>>>>>> ab4fa8621938f2d3ccf66f7c0d27fd99d351b5ad:level_up_react/src/pages/catalogo.jsx
        </div>
    );
};

export default Catalogo;