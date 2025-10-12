import React from 'react';
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
        </div>
    );
};

export default Catalogo;