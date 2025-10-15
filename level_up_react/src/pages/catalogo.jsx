import React from 'react';
import { useState, useMemo } from 'react';
import Header from '../components/header';
import CardsContainer from '../components/gridCards';
import NavbarProductos from '../components/navProductos';
import listaProductos from '../assets/listaProductos';

import '../styles/pages/catalogoStyles.css';


    

export default function Catalogo () {
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Filtrar productos basado en la categoría seleccionada
    const filteredProducts = useMemo(() => {
        if (!selectedCategory) {
        return listaProductos;
        }
        return listaProductos.filter(producto => producto.Categoría === selectedCategory);
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };
    return (
        <div >
            <Header />
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            <hr />
                            <h1 className="titulo">
                                Catálogo
                            </h1>
                            <h4 className='titulo2'>
                                {selectedCategory ? `${selectedCategory}` : 'Todos los Productos'}
                            </h4>
                            <hr />
                            <NavbarProductos onCategoryChange={handleCategoryChange} />
                            <CardsContainer productos={filteredProducts} />
                        </div>
                        <div className="col-2"></div>
                    </div>
                </div>
                
            </main>
        </div>
    );
};
